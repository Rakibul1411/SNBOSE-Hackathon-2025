"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"

interface RelatedPostsProps {
  spaceId: string
  currentPostId: string
  tags: string[]
}

export default function RelatedPosts({ spaceId, currentPostId, tags }: RelatedPostsProps) {
  const getRelatedPosts = () => {
    // This would typically come from a database, filtered by tags and space
    return [
      {
        id: "double-slit-experiment",
        title: "The Double-Slit Experiment: Wave-Particle Duality",
        space: "Physics Phenomena",
        tags: ["Quantum", "Physics", "Experiment"],
        timeAgo: "1 day ago",
      },
      {
        id: "quantum-computing",
        title: "Quantum Computing: Principles and Applications",
        space: "Physics Phenomena",
        tags: ["Quantum", "Computing", "Technology"],
        timeAgo: "3 days ago",
      },
      {
        id: "schrodingers-cat",
        title: "Understanding Schrödinger's Cat Thought Experiment",
        space: "Physics Phenomena",
        tags: ["Quantum", "Thought Experiment"],
        timeAgo: "1 week ago",
      },
      {
        id: "quantum-tunneling",
        title: "Quantum Tunneling and Its Applications",
        space: "Physics Phenomena",
        tags: ["Quantum", "Physics", "Applications"],
        timeAgo: "2 weeks ago",
      },
    ].filter((post) => post.id !== currentPostId)
  }

  const relatedPosts = getRelatedPosts()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Discussions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {relatedPosts.map((post, index) => (
            <div key={post.id} className={index !== 0 ? "pt-4 border-t" : ""}>
              <Link href={`/ideaverse/post/${post.id}`} className="block hover:text-primary transition-colors">
                <h3 className="font-medium text-sm mb-1">{post.title}</h3>
              </Link>
              <div className="flex flex-wrap gap-1 mb-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 2} more
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                in{" "}
                <Link
                  href={`/ideaverse/space/${post.space.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-primary hover:underline"
                >
                  {post.space}
                </Link>{" "}
                • {post.timeAgo}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
