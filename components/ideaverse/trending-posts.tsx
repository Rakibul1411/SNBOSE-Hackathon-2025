"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { MessageSquare, ThumbsUp, Eye, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function TrendingPosts() {
  const trendingPosts = [
    {
      id: "quantum-entanglement",
      title: "Understanding Quantum Entanglement",
      space: "Physics Phenomena",
      author: {
        name: "Dr. Alex Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      comments: 42,
      likes: 128,
      views: 1543,
      tags: ["Quantum", "Physics"],
      timeAgo: "2 hours ago",
    },
    {
      id: "crispr-advances",
      title: "Recent Advances in CRISPR Technology",
      space: "Molecular Biology",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      comments: 36,
      likes: 95,
      views: 1287,
      tags: ["CRISPR", "Genetics"],
      timeAgo: "5 hours ago",
    },
    {
      id: "black-holes",
      title: "Black Holes: What We Know in 2023",
      space: "Space Exploration",
      author: {
        name: "Michael Wong",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      comments: 58,
      likes: 176,
      views: 2134,
      tags: ["Astronomy", "Black Holes"],
      timeAgo: "1 day ago",
    },
    {
      id: "neural-networks",
      title: "How Neural Networks Mimic Brain Function",
      space: "Neuroscience",
      author: {
        name: "Dr. Emily Patel",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      comments: 29,
      likes: 87,
      views: 976,
      tags: ["Neuroscience", "AI"],
      timeAgo: "2 days ago",
    },
    {
      id: "arduino-projects",
      title: "5 Cool Arduino Projects for Beginners",
      space: "Electronics & DIY",
      author: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      comments: 47,
      likes: 132,
      views: 1876,
      tags: ["Arduino", "DIY"],
      timeAgo: "3 days ago",
    },
  ]

  return (
    <div className="space-y-4">
      {trendingPosts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">
                  <Link href={`/ideaverse/post/${post.id}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
              </div>
              <CardDescription className="flex items-center gap-1 text-xs">
                in{" "}
                <Link
                  href={`/ideaverse/space/${post.space.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-primary hover:underline"
                >
                  {post.space}
                </Link>{" "}
                • {post.timeAgo}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{post.views}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{post.author.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <Button variant="outline" className="w-full" asChild>
        <Link href="/ideaverse/trending">
          View All Trending
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
