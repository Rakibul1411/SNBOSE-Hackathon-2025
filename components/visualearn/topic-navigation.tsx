"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface TopicNavigationProps {
  subject: string
  chapter: string
  topic: {
    id: string
    title: string
    nextTopic: string | null
    prevTopic: string | null
  }
}

export default function TopicNavigation({ subject, chapter, topic }: TopicNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/visualearn/${subject}/${chapter}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Chapter
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/visualearn">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {topic.prevTopic && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/visualearn/${subject}/${chapter}/topics/${topic.prevTopic}`}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            </Button>
          )}

          {topic.nextTopic && (
            <Button variant="default" size="sm" asChild>
              <Link href={`/visualearn/${subject}/${chapter}/topics/${topic.nextTopic}`}>
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
