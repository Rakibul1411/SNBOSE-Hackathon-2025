"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, HelpCircle, Lightbulb, X } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { createPost } from "@/actions/forum-actions"

interface CreatePostFormProps {
  spaceId: string
  spaceName: string
}

export default function CreatePostForm({ spaceId, spaceName }: CreatePostFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [postType, setPostType] = useState<"discussion" | "question">("discussion")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  
  
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // if (!user?.id) {
    //   toast({
    //     title: "Authentication required",
    //     description: "Please log in to create a post.",
    //     variant: "destructive",
    //   })
    //   return
    // }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Incomplete form",
        description: "Please provide both a title and content for your post.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const post = {
        title,
        content,
        type: postType,
        tags,
      }

      const newPost = await createPost(spaceId, "81d70a3f-d5d5-4878-a51c-3953a4203588", post)

      console.log("Post created successfully:,,,,,,,,,,,...........................", "81d70a3f-d5d5-4878-a51c-3953a4203588")

      toast({
        title: "Post created",
        description: "Your post has been successfully created.",
      })

      // Redirect to the new post
      router.push(`/ideaverse/post/${newPost.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to create your post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/ideaverse/space/${spaceId}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {spaceName}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a New Post in {spaceName}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="post-type">Post Type</Label>
              <RadioGroup
                id="post-type"
                value={postType}
                onValueChange={(value) => setPostType(value as "discussion" | "question")}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="discussion" id="discussion" />
                  <Label htmlFor="discussion" className="flex items-center cursor-pointer">
                    <Lightbulb className="h-4 w-4 mr-2 text-green-500" />
                    Discussion
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="question" id="question" />
                  <Label htmlFor="question" className="flex items-center cursor-pointer">
                    <HelpCircle className="h-4 w-4 mr-2 text-blue-500" />
                    Question
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title"
                required
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground text-right">{title.length}/100 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  postType === "question"
                    ? "Describe your question in detail..."
                    : "Share your thoughts or knowledge..."
                }
                required
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (up to 5)</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add tags and press Enter"
                  disabled={tags.length >= 5}
                />
                <Button type="button" onClick={handleAddTag} disabled={!tagInput.trim() || tags.length >= 5}>
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter or comma after each tag. You can add up to 5 tags.
              </p>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full p-0"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag} tag</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" asChild>
                <Link href={`/ideaverse/space/${spaceId}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()}>
                {isSubmitting ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
