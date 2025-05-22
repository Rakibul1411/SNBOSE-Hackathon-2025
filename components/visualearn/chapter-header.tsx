"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface ChapterHeaderProps {
  subject: string
  chapter: {
    id: string
    subject: string
    title: string
    description: string
    topics: number
  }
}

export default function ChapterHeader({ subject, chapter }: ChapterHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/visualearn/${subject}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {chapter.subject}
          </Link>
        </Button>
      </div>

      <div className="p-6 rounded-lg bg-primary/5">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="p-4 rounded-full bg-primary/10">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{chapter.title}</h1>
              <Badge variant="outline" className="ml-2">
                <BookOpen className="h-3 w-3 mr-1" />
                {chapter.topics} topics
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">{chapter.description}</p>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href={`/visualearn/${subject}/${chapter.id}/topics/1`}>Start Learning</Link>
              </Button>
              <Button variant="outline" size="sm">
                View Overview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
