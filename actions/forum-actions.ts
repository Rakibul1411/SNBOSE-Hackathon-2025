"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { Post, Space } from "@/types/database"
import { slugify } from "@/lib/utils"

// Get all spaces
export async function getSpaces() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("spaces").select("*").order("title")

  console.log("---------Fetched spaces:", data)

  if (error) {
    console.error("Error fetching spaces:", error)
    throw new Error("Failed to fetch spaces")
  }

  return data
}

// Get space by slug
export async function getSpaceBySlug(slug: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("spaces").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching space with slug ${slug}:`, error)
    return null
  }

  return data
}

// Create a new space
export async function createSpace(space: Partial<Space>) {
  const supabase = createServerSupabaseClient()

  try {
    if (!space.title) {
      throw new Error("Space title is required")
    }

    // Verify that created_by is provided
    if (!space.created_by) {
      throw new Error("User authentication is required")
    }

    const slug = slugify(space.title)

    // First create the space
    const { data, error } = await supabase
      .from("spaces")
      .insert({
        title: space.title,
        description: space.description,
        icon: space.icon,
        color: space.color,
        slug,
        created_by: space.created_by,
        members_count: 1, // Creator is the first member
        posts_count: 0,
        tags: space.tags || [],
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating space:", {
        error,
        space,
        errorMessage: error.message,
        details: error.details,
        hint: error.hint
      })
      if (error.code === "23505") { // Unique violation
        throw new Error("A space with this title already exists. Please choose a different title.")
      }
      throw new Error(`Failed to create space: ${error.message}`)
    }

    console.log("Space created successfully:", data)

    // Add creator as a member
    if (!data || !data.id || !space.created_by) {
      console.error("Missing data for space membership:", { 
        dataExists: !!data,
        spaceId: data?.id,
        userId: space.created_by
      })
      throw new Error("Failed to create space membership - missing required data")
    }
    
    const { error: memberError } = await supabase.from("space_members").insert({
      space_id: data.id,
      user_id: space.created_by,
      role: "admin",
    })

    if (memberError) {
      console.error("Error adding creator as member:", {
        error: memberError,
        spaceId: data.id,
        userId: space.created_by,
        errorMessage: memberError.message,
        details: memberError.details,
        hint: memberError.hint
      })
    }

    revalidatePath("/ideaverse")
    return data
  } catch (error) {
    console.error("Unexpected error in createSpace:", error)
    throw error
  }
}

// Get posts for a space
export async function getPostsBySpaceId(spaceId: string, sortBy: "trending" | "recent" | "top" = "trending") {
  const supabase = createServerSupabaseClient()

  spaceId = '81d70a3f-d5d5-4878-a51c-3953a4203588'

  let query = supabase
    .from("posts")
    .select(`
      *,
      profiles!user_id(name)
    `)
    .eq("space_id", spaceId)

  // Apply sorting
  if (sortBy === "recent") {
    query = query.order("created_at", { ascending: false })
  } else if (sortBy === "top") {
    query = query.order("likes_count", { ascending: false })
  } else {
    // trending - combination of recency and popularity
    query = query.order("created_at", { ascending: false }).order("likes_count", { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error(`Error fetching posts for space ${spaceId}:`, error)
    throw new Error("Failed to fetch posts")
  }

  // Format the posts to include author
  const formattedPosts = data.map((post) => {
    const author = post.profiles
      ? {
          full_name: post.profiles.name,
        }
      : undefined

    delete post.profiles

    return {
      ...post,
      author,
    }
  })

  return formattedPosts
}

// Get post by ID
export async function getPostById(postId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles!posts_user_id_fkey(full_name, avatar_url),
      post_tags(tag)
    `)
    .eq("id", postId)
    .single()

  if (error) {
    console.error(`Error fetching post ${postId}:`, error)
    return null
  }

  // Format the post to include tags array
  const tags = data.post_tags ? data.post_tags.map((t: { tag: string }) => t.tag) : []
  const author = data.profiles
    ? {
        full_name: data.profiles.full_name,
        avatar_url: data.profiles.avatar_url,
      }
    : undefined

  delete data.post_tags
  delete data.profiles

  return {
    ...data,
    tags,
    author,
  }
}

// Create a new post
export async function createPost(spaceId: string, userId: string, post: Partial<Post>) {
  const supabase = createServerSupabaseClient()

  console.log(".............................Creating post:", { spaceId, userId, post })

  // First create the post
  const { data, error } = await supabase
    .from("posts")
    .insert({
      space_id: spaceId,
      user_id: userId,
      title: post.title,
      content: post.content,
      types: post.types || "discussion",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating post:", error)
    throw new Error("Failed to create post")
  }

  // Then add tags if any
  if (post.tags && post.tags.length > 0) {
    const tagInserts = post.tags.map((tag) => ({
      post_id: data.id,
      tag,
    }))

    const { error: tagError } = await supabase.from("post_tags").insert(tagInserts)

    if (tagError) {
      console.error("Error adding tags to post:", tagError)
    }
  }

  revalidatePath(`/ideaverse/space/${spaceId}`)
  return data
}

// Update post views
export async function incrementPostViews(postId: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.rpc("increment_post_views", {
    post_id: postId,
  })

  if (error) {
    console.error(`Error incrementing views for post ${postId}:`, error)
  }
}

// Vote on a post
export async function voteOnPost(postId: string, userId: string, voteType: "like" | "dislike") {
  const supabase = createServerSupabaseClient()

  // Check if user already voted
  const { data: existingVote, error: checkError } = await supabase
    .from("post_votes")
    .select("vote_type")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking existing vote:", checkError)
    throw new Error("Failed to vote on post")
  }

  // Handle the vote
  if (!existingVote) {
    // New vote
    const { error } = await supabase.from("post_votes").insert({
      post_id: postId,
      user_id: userId,
      vote_type: voteType,
    })

    if (error) {
      console.error("Error adding vote:", error)
      throw new Error("Failed to vote on post")
    }

    // Update post counts
    if (voteType === "like") {
      await supabase.rpc("increment_post_likes", { post_id: postId })
    } else {
      await supabase.rpc("increment_post_dislikes", { post_id: postId })
    }
  } else if (existingVote.vote_type !== voteType) {
    // Change vote
    const { error } = await supabase
      .from("post_votes")
      .update({ vote_type: voteType })
      .eq("post_id", postId)
      .eq("user_id", userId)

    if (error) {
      console.error("Error changing vote:", error)
      throw new Error("Failed to vote on post")
    }

    // Update post counts
    if (voteType === "like") {
      await supabase.rpc("increment_post_likes", { post_id: postId })
      await supabase.rpc("decrement_post_dislikes", { post_id: postId })
    } else {
      await supabase.rpc("increment_post_dislikes", { post_id: postId })
      await supabase.rpc("decrement_post_likes", { post_id: postId })
    }
  } else {
    // Remove vote
    const { error } = await supabase.from("post_votes").delete().eq("post_id", postId).eq("user_id", userId)

    if (error) {
      console.error("Error removing vote:", error)
      throw new Error("Failed to vote on post")
    }

    // Update post counts
    if (voteType === "like") {
      await supabase.rpc("decrement_post_likes", { post_id: postId })
    } else {
      await supabase.rpc("decrement_post_dislikes", { post_id: postId })
    }
  }

  revalidatePath(`/ideaverse/post/${postId}`)
}

// Get comments for a post
export async function getCommentsByPostId(postId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles!comments_user_id_fkey(full_name, avatar_url)
    `)
    .eq("post_id", postId)
    .is("parent_id", null)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)
    throw new Error("Failed to fetch comments")
  }

  // Get replies for each comment
  const commentsWithReplies = await Promise.all(
    data.map(async (comment) => {
      const { data: replies, error: repliesError } = await supabase
        .from("comments")
        .select(`
          *,
          profiles!comments_user_id_fkey(full_name, avatar_url)
        `)
        .eq("parent_id", comment.id)
        .order("created_at", { ascending: true })

      if (repliesError) {
        console.error(`Error fetching replies for comment ${comment.id}:`, repliesError)
        return {
          ...comment,
          author: comment.profiles
            ? {
                full_name: comment.profiles.full_name,
                avatar_url: comment.profiles.avatar_url,
              }
            : undefined,
          replies: [],
        }
      }

      const formattedReplies = replies.map((reply) => ({
        ...reply,
        author: reply.profiles
          ? {
              full_name: reply.profiles.full_name,
              avatar_url: reply.profiles.avatar_url,
            }
          : undefined,
      }))

      return {
        ...comment,
        author: comment.profiles
          ? {
              full_name: comment.profiles.full_name,
              avatar_url: comment.profiles.avatar_url,
            }
          : undefined,
        replies: formattedReplies,
      }
    }),
  )

  return commentsWithReplies
}

// Create a comment
export async function createComment(postId: string, userId: string, content: string, parentId?: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: userId,
      parent_id: parentId || null,
      content,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating comment:", error)
    throw new Error("Failed to create comment")
  }

  revalidatePath(`/ideaverse/post/${postId}`)
  return data
}

// Like a comment
export async function likeComment(commentId: string, userId: string) {
  const supabase = createServerSupabaseClient()

  // Check if user already liked
  const { data: existingLike, error: checkError } = await supabase
    .from("comment_votes")
    .select()
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking existing like:", checkError)
    throw new Error("Failed to like comment")
  }

  if (!existingLike) {
    // Add like
    const { error } = await supabase.from("comment_votes").insert({
      comment_id: commentId,
      user_id: userId,
    })

    if (error) {
      console.error("Error adding like:", error)
      throw new Error("Failed to like comment")
    }

    // Increment comment likes
    const { error: updateError } = await supabase
      .from("comments")
      .update({ likes: supabase.rpc("increment", { row_id: commentId, table: "comments", column: "likes" }) })
      .eq("id", commentId)

    if (updateError) {
      console.error("Error incrementing likes:", updateError)
    }
  } else {
    // Remove like
    const { error } = await supabase.from("comment_votes").delete().eq("comment_id", commentId).eq("user_id", userId)

    if (error) {
      console.error("Error removing like:", error)
      throw new Error("Failed to unlike comment")
    }

    // Decrement comment likes
    const { error: updateError } = await supabase
      .from("comments")
      .update({ likes: supabase.rpc("decrement", { row_id: commentId, table: "comments", column: "likes" }) })
      .eq("id", commentId)

    if (updateError) {
      console.error("Error decrementing likes:", updateError)
    }
  }

  // Get the post ID for this comment
  const { data: comment, error: commentError } = await supabase
    .from("comments")
    .select("post_id")
    .eq("id", commentId)
    .single()

  if (commentError) {
    console.error("Error fetching comment:", commentError)
  } else {
    revalidatePath(`/ideaverse/post/${comment.post_id}`)
  }
}

// Get related posts
export async function getRelatedPosts(spaceId: string, currentPostId: string, tags: string[]) {
  const supabase = createServerSupabaseClient()

  // Get posts with matching tags
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      post_tags(tag)
    `)
    .eq("space_id", spaceId)
    .neq("id", currentPostId)
    .limit(5)

  if (error) {
    console.error("Error fetching related posts:", error)
    throw new Error("Failed to fetch related posts")
  }

  // Format posts and sort by tag relevance
  const formattedPosts = data.map((post) => {
    const postTags = post.post_tags ? post.post_tags.map((t: { tag: string }) => t.tag) : []
    delete post.post_tags

    // Calculate relevance score (number of matching tags)
    const relevanceScore = postTags.filter((tag) => tags.includes(tag)).length

    return {
      ...post,
      tags: postTags,
      relevanceScore,
    }
  })

  // Sort by relevance score (descending)
  return formattedPosts.sort((a, b) => b.relevanceScore - a.relevanceScore)
}

