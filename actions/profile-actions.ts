"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { Profile } from "@/types/database"

// Get user profile
export async function getUserProfile(userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error && error.code !== "PGRST116") {
    console.error(`Error fetching profile for user ${userId}:`, error)
    throw new Error("Failed to fetch profile")
  }

  return data || null
}

// Update user profile
export async function updateUserProfile(userId: string, profile: Partial<Profile>) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    ...profile,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error updating profile:", error)
    throw new Error("Failed to update profile")
  }

  revalidatePath("/profile")
}

// Get user activity
export async function getUserActivity(userId: string) {
  const supabase = createServerSupabaseClient()

  // Get learning activity (completed topics and quizzes)
  const { data: learningActivity, error: learningError } = await supabase
    .from("user_progress")
    .select(`
      *,
      topics!inner(
        id,
        title,
        slug,
        chapters!inner(
          id,
          title,
          slug,
          subjects!inner(
            id,
            title,
            slug
          )
        )
      )
    `)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(10)

  if (learningError) {
    console.error("Error fetching learning activity:", learningError)
    throw new Error("Failed to fetch user activity")
  }

  // Get community activity (posts and comments)
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      type,
      created_at,
      spaces!inner(
        id,
        title,
        slug
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  if (postsError) {
    console.error("Error fetching posts:", postsError)
    throw new Error("Failed to fetch user activity")
  }

  const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select(`
      id,
      content,
      created_at,
      posts!inner(
        id,
        title,
        spaces!inner(
          id,
          title,
          slug
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  if (commentsError) {
    console.error("Error fetching comments:", commentsError)
    throw new Error("Failed to fetch user activity")
  }

  // Format learning activity
  const formattedLearningActivity = learningActivity.map((activity) => {
    const topic = activity.topics
    const chapter = topic.chapters
    const subject = chapter.subjects

    return {
      id: activity.id,
      type: activity.quiz_score !== null ? "quiz-completed" : "topic-completed",
      title:
        activity.quiz_score !== null
          ? `Scored ${activity.quiz_score}% on ${topic.title} Quiz`
          : `Completed: ${topic.title}`,
      subject: subject.title,
      chapter: chapter.title,
      date: activity.updated_at,
      url: `/visualearn/${subject.slug}/${chapter.slug}/topics/${topic.slug}`,
    }
  })

  // Format community activity
  const formattedPosts = posts.map((post) => ({
    id: post.id,
    type: "post-created",
    title: `Posted: ${post.title}`,
    space: post.spaces.title,
    date: post.created_at,
    url: `/ideaverse/post/${post.id}`,
  }))

  const formattedComments = comments.map((comment) => ({
    id: comment.id,
    type: "comment-created",
    title: `Commented on: ${comment.posts.title}`,
    space: comment.posts.spaces.title,
    date: comment.created_at,
    url: `/ideaverse/post/${comment.posts.id}`,
  }))

  // Combine and sort by date
  const communityActivity = [...formattedPosts, ...formattedComments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return {
    learningActivity: formattedLearningActivity,
    communityActivity,
  }
}
