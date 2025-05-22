"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  ArrowLeft,
  HelpCircle,
  Lightbulb,
  Share2,
  Bookmark,
  Flag,
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { voteOnPost, getSpaceBySlug } from "@/actions/forum-actions"
import { format } from "date-fns"
import type { Post, Space } from "@/types/database"

interface PostDetailProps {
  post: Post
}

export default function PostDetail({ post }: PostDetailProps) {
  const [likes, setLikes] = useState(post.likes)
  const [dislikes, setDislikes] = useState(post.dislikes)
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [space, setSpace] = useState<Space | null>(null)
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const spaceData = await getSpaceBySlug(post.space_id)
        console.log("-----------------------Fetched space data:-------------------------------", spaceData)
        if (spaceData) {
          setSpace(spaceData)
        }
      } catch (error) {
        console.error("Error fetching space:", error)
      }
    }

    fetchSpace()
  }, [post.space_id])

  const handleLike = async () => {
    if (!isAuthenticated || !user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on posts.",
        variant: "destructive",
      })
      return
    }

    try {
      if (userVote === "like") {
        // Remove like
        setLikes(likes - 1)
        setUserVote(null)
      } else {
        // Add like (or change from dislike to like)
        setLikes(userVote === "dislike" ? likes + 1 : likes + 1)
        setDislikes(userVote === "dislike" ? dislikes - 1 : dislikes)
        setUserVote("like")
      }

      await voteOnPost(post.id, user.id, "like")
    } catch (error) {
      console.error("Error voting on post:", error)
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      })

      // Revert optimistic update on error
      setLikes(post.likes)
      setDislikes(post.dislikes)
      setUserVote(null)
    }
  }

  const handleDislike = async () => {
    if (!isAuthenticated || !user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on posts.",
        variant: "destructive",
      })
      return
    }

    try {
      if (userVote === "dislike") {
        // Remove dislike
        setDislikes(dislikes - 1)
        setUserVote(null)
      } else {
        // Add dislike (or change from like to dislike)
        setDislikes(userVote === "like" ? dislikes + 1 : dislikes + 1)
        setLikes(userVote === "like" ? likes - 1 : likes)
        setUserVote("dislike")
      }

      await voteOnPost(post.id, user.id, "dislike")
    } catch (error) {
      console.error("Error voting on post:", error)
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      })

      // Revert optimistic update on error
      setLikes(post.likes)
      setDislikes(post.dislikes)
      setUserVote(null)
    }
  }

  const toggleBookmark = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark posts.",
        variant: "destructive",
      })
      return
    }

    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "Bookmark removed" : "Bookmark added",
      description: isBookmarked
        ? "This post has been removed from your bookmarks."
        : "This post has been added to your bookmarks.",
    })
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPpp") // Format: Jan 1, 2023, 12:00 PM
    } catch (error) {
      return "Unknown date"
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/ideaverse/space/${post.space_id}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {space?.title || "Space"}
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
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
            <CardDescription className="flex items-center gap-1">
              in{" "}
              <Link href={`/ideaverse/space/${post.space_id}`} className="text-primary hover:underline">
                {space?.title || "Loading..."}
              </Link>
            </CardDescription>
          </div>

          <CardTitle className="text-2xl">{post.title}</CardTitle>

          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author?.avatar_url || "/placeholder.svg"} alt={post.author?.full_name || ""} />
              <AvatarFallback>{getInitials(post.author?.full_name || "A")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author?.full_name || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">Posted on {formatDate(post.created_at)}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            {post.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-6">
            {post.tags &&
              post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap justify-between gap-4 border-t pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={userVote === "like" ? "bg-green-100 text-green-600 dark:bg-green-900/20" : ""}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {likes}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDislike}
                className={userVote === "dislike" ? "bg-red-100 text-red-600 dark:bg-red-900/20" : ""}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                {dislikes}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments_count || 0} comments</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{post.views} views</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleBookmark}>
              <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? "fill-current" : ""}`} />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.content.substring(0, 100) + "...",
                    url: window.location.href,
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  toast({
                    title: "Link copied",
                    description: "The link to this post has been copied to your clipboard.",
                  })
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!isAuthenticated) {
                  toast({
                    title: "Authentication required",
                    description: "Please log in to report posts.",
                    variant: "destructive",
                  })
                  return
                }

                toast({
                  title: "Report submitted",
                  description: "Thank you for your report. Our team will review this post.",
                })
              }}
            >
              <Flag className="h-4 w-4 mr-1" />
              Report
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
