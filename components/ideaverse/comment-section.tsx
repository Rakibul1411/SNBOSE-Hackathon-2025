"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, MessageSquare, CornerDownRight, Flag } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { getCommentsByPostId, createComment, likeComment } from "@/actions/forum-actions"
import type { CommentWithReplies, CommentAuthor } from "@/types/database"

interface CommentSectionProps {
  postId: string
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("")
  const [replyText, setReplyText] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [comments, setComments] = useState<CommentWithReplies[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getCommentsByPostId(postId)
        setComments(fetchedComments || [])
      } catch (error) {
        console.error("Error fetching comments:", error)
        // toast({
        //   title: "Error",
        //   description: "Failed to load comments. Please try again.",
        //   variant: "destructive",
        // })
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [postId, toast])

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !isAuthenticated || !user?.id) return

    try {
      await createComment(postId, user.id, commentText)

      // Refresh comments
      const updatedComments = await getCommentsByPostId(postId)
      setComments(updatedComments || [])

      setCommentText("")
      toast({
        title: "Success",
        description: "Your comment has been posted.",
      })
    } catch (error) {
      console.error("Error posting comment:", error)
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitReply = async (commentId: string) => {
    if (!replyText.trim() || !isAuthenticated || !user?.id) return

    try {
      await createComment(postId, user.id, replyText, commentId)

      // Refresh comments
      const updatedComments = await getCommentsByPostId(postId)
      setComments(updatedComments || [])

      setReplyText("")
      setReplyingTo(null)
      toast({
        title: "Success",
        description: "Your reply has been posted.",
      })
    } catch (error) {
      console.error("Error posting reply:", error)
      toast({
        title: "Error",
        description: "Failed to post your reply. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated || !user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to like comments.",
        variant: "destructive",
      })
      return
    }

    try {
      await likeComment(commentId, user.id)

      // Refresh comments
      const updatedComments = await getCommentsByPostId(postId)
      setComments(updatedComments || [])

      toast({
        title: "Success",
        description: "Your vote has been recorded.",
      })
    } catch (error) {
      console.error("Error liking comment:", error)
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId)
    setReplyText("")
  }

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

  const renderAuthor = (author: CommentAuthor | undefined) => {
    const displayName = author?.full_name || "Anonymous User"
    const avatarUrl = author?.avatar_url || "/placeholder.svg?height=40&width=40"

    return (
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />
        <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Comments {!isLoading && `(${comments.length})`}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isAuthenticated ? (
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.user_metadata?.avatar_url || "/placeholder.svg"}
                  alt={user?.user_metadata?.full_name || ""}
                />
                <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button onClick={handleSubmitComment} disabled={!commentText.trim()}>
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 bg-muted rounded-md">
              <p className="text-muted-foreground mb-2">You need to be logged in to comment</p>
              <Button asChild>
                <Link href="/auth/login?redirect=/ideaverse/post/${postId}">Login</Link>
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4 mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1">
                    <div className="h-32 bg-muted rounded-md animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-6 mt-6">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  <div className="flex gap-4">
                    {renderAuthor(comment.author)}
                    <div className="flex-1">
                      <div className="bg-muted p-4 rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{comment.author?.full_name || "Anonymous User"}</p>
                            <p className="text-xs text-muted-foreground">{formatTimeAgo(comment.created_at)}</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Flag className="h-4 w-4" />
                            <span className="sr-only">Report</span>
                          </Button>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>

                      <div className="flex items-center gap-4 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleLikeComment(comment.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {comment.likes || 0}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => toggleReply(comment.id)}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      </div>

                      {replyingTo === comment.id && isAuthenticated && (
                        <div className="mt-4 flex gap-4">
                          <div className="w-6 flex justify-center">
                            <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="Write a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="resize-none"
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setReplyingTo(null)}>
                                Cancel
                              </Button>
                              <Button onClick={() => handleSubmitReply(comment.id)} disabled={!replyText.trim()}>
                                Post Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-4">
                              <div className="w-6 flex justify-center">
                                <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                              {renderAuthor(reply.author)}
                              <div className="flex-1">
                                <div className="bg-muted p-3 rounded-md">
                                  <div className="flex justify-between items-start mb-1">
                                    <div>
                                      <p className="font-medium text-sm">
                                        {reply.author?.full_name || "Anonymous User"}
                                      </p>
                                      <p className="text-xs text-muted-foreground">{formatTimeAgo(reply.created_at)}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <Flag className="h-3 w-3" />
                                      <span className="sr-only">Report</span>
                                    </Button>
                                  </div>
                                  <p className="text-sm">{reply.content}</p>
                                </div>

                                <div className="flex items-center gap-4 mt-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => handleLikeComment(reply.id)}
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {reply.likes || 0}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {!isLoading && comments.length > 5 && (
          <CardFooter className="flex justify-center border-t pt-6">
            <Button variant="outline">Load More Comments</Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}
