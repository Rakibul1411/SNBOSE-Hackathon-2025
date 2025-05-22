"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { MessageSquare, ThumbsUp, ThumbsDown, Eye, ArrowRight, HelpCircle, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { getPostsBySpaceId, incrementPostViews } from "@/actions/forum-actions"
import { formatDistanceToNow } from "date-fns"
import type { Post } from "@/types/database"

interface PostListProps {
  spaceId: string
  sortBy?: "trending" | "recent" | "top"
}

export default function PostList({ spaceId, sortBy = "trending" }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        const postsData = await getPostsBySpaceId(spaceId, sortBy)
        setPosts(postsData || [])
      } catch (error) {
        console.error(`Error fetching posts for space ${spaceId}:`, error)
        toast({
          title: "Error",
          description: "Failed to load posts. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [spaceId, sortBy, toast])

  const handlePostClick = async (postId: string) => {
    try {
      await incrementPostViews(postId)
    } catch (error) {
      console.error(`Error incrementing views for post ${postId}:`, error)
    }
  }

  // Fallback posts if database is empty or loading
  const getFallbackPosts = () => {
    if (spaceId === "physics-phenomena") {
      return [
        {
          id: "quantum-entanglement",
          title: "Understanding Quantum Entanglement",
          content:
            "I've been trying to understand quantum entanglement, but I'm struggling with the concept. Can someone explain it in simple terms?",
          type: "question",
          space_id: spaceId,
          user_id: "",
          created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          updated_at: new Date(Date.now() - 7200000).toISOString(),
          likes: 128,
          dislikes: 5,
          views: 1543,
          tags: ["Quantum", "Physics"],
          author: {
            full_name: "Dr. Alex Chen",
            avatar_url: "/placeholder.svg?height=40&width=40",
          },
        },
        {
          id: "double-slit-experiment",
          title: "The Double-Slit Experiment: Wave-Particle Duality",
          content:
            "The double-slit experiment is one of the most fascinating experiments in physics. It demonstrates the wave-particle duality of light and matter...",
          author: {
            full_name: "Prof. Richard Lee",
            avatar_url: "/placeholder.svg?height=40&width=40",
          },
          comments_count: 36,
          likes: 95,
          dislikes: 2,
          views: 1287,
          tags: ["Quantum", "Wave-Particle"],
          type: "discussion",
          space_id: spaceId,
          user_id: "",
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updated_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "magnetic-monopoles",
          title: "Do Magnetic Monopoles Exist?",
          content:
            "Magnetic monopoles are hypothetical elementary particles that carry a single magnetic pole (either a north or south pole). Unlike ordinary magnets, which have both north and south poles...",
          author: {
            full_name: "Sarah Johnson",
            avatar_url: "/placeholder.svg?height=40&width=40",
          },
          comments_count: 28,
          likes: 76,
          dislikes: 3,
          views: 982,
          tags: ["Magnetism", "Theoretical"],
          type: "discussion",
          space_id: spaceId,
          user_id: "",
          created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          updated_at: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          id: "time-dilation",
          title: "How Does Time Dilation Work?",
          content:
            "I understand the basic concept of time dilation from special relativity, but I'm having trouble visualizing how it works in practice. Can someone provide some examples?",
          author: {
            full_name: "Michael Wong",
            avatar_url: "/placeholder.svg?height=40&width=40",
          },
          comments_count: 52,
          likes: 143,
          dislikes: 1,
          views: 1876,
          tags: ["Relativity", "Time"],
          type: "question",
          space_id: spaceId,
          user_id: "",
          created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
          updated_at: new Date(Date.now() - 432000000).toISOString(),
        },
      ]
    } else if (spaceId === "molecular-biology") {
      return [
        {
          id: "crispr-advances",
          title: "Recent Advances in CRISPR Technology",
          content:
            "CRISPR-Cas9 has revolutionized genetic engineering. Here are some recent advances that are pushing the boundaries of what's possible...",
          author: {
            full_name: "Dr. Emily Patel",
            avatar_url: "/placeholder.svg?height=40&width=40",
          },
          comments_count: 36,
          likes: 95,
          dislikes: 2,
          views: 1287,
          tags: ["CRISPR", "Genetics"],
          type: "discussion",
          space_id: spaceId,
          user_id: "",
          created_at: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
          updated_at: new Date(Date.now() - 18000000).toISOString(),
        },
      ]
    }

    // Default posts for demo purposes
    return [
      {
        id: "post-1",
        title: "Sample Post 1",
        content: "This is a sample post content...",
        author: {
          full_name: "John Doe",
          avatar_url: "/placeholder.svg?height=40&width=40",
        },
        comments_count: 10,
        likes: 25,
        dislikes: 1,
        views: 300,
        tags: ["Sample", "Demo"],
        type: "discussion",
        space_id: spaceId,
        user_id: "",
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "post-2",
        title: "Sample Post 2",
        content: "This is another sample post content...",
        author: {
          full_name: "Jane Smith",
          avatar_url: "/placeholder.svg?height=40&width=40",
        },
        comments_count: 5,
        likes: 15,
        dislikes: 0,
        views: 200,
        tags: ["Sample", "Test"],
        type: "question",
        space_id: spaceId,
        user_id: "",
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updated_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ]
  }

  const postsToDisplay = isLoading || posts.length === 0 ? getFallbackPosts() : posts

  const formatTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch (error) {
      return "some time ago"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="h-7 w-32 bg-muted rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-muted rounded animate-pulse mt-2" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="h-16 bg-muted rounded animate-pulse mb-4" />
              <div className="flex gap-2 mb-2">
                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-4">
                <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                <div className="h-5 w-16 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-5 w-24 bg-muted rounded animate-pulse" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {postsToDisplay.length === 0 ? (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-4">Be the first to start a discussion in this space!</p>
          <Button asChild>
            <Link href={`/ideaverse/space/${spaceId}/new-post`}>Create Post</Link>
          </Button>
        </div>
      ) : (
        postsToDisplay.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        post.type === "question"
                          ? "bg-blue-100 text-blue-500 dark:bg-blue-900/20"
                          : "bg-green-100 text-green-500 dark:bg-green-900/20"
                      }
                    >
                      {post.type === "question" ? (
                        <HelpCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Lightbulb className="h-3 w-3 mr-1" />
                      )}
                      {post.type === "question" ? "Question" : "Discussion"}
                    </Badge>
                    <CardTitle className="text-xl">
                      <Link
                        href={`/ideaverse/post/${post.id}`}
                        className="hover:text-primary transition-colors"
                        onClick={() => handlePostClick(post.id)}
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-1 text-xs">
                  Posted by {post.author?.full_name || "Anonymous"} • {formatTimeAgo(post.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm line-clamp-3 mb-4">{post.content}</p>

                <div className="flex items-center gap-2 mb-2">
                  {post.tags &&
                    post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{post.comments_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      <span>{post.dislikes}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{post.views}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={post.author?.avatar_url || "/placeholder.svg"}
                      alt={post.author?.full_name || ""}
                    />
                    <AvatarFallback>{getInitials(post.author?.full_name || "A")}</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/ideaverse/post/${post.id}`} onClick={() => handlePostClick(post.id)}>
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}
