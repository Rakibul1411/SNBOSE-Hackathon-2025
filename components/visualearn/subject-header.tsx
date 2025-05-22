"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Atom, Dna, FlaskRoundIcon as Flask, Microscope, Rocket, Zap, BookOpen, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface SubjectHeaderProps {
  subject: {
    id: string
    title: string
    description: string
    icon: string
    color: string
  }
}

export default function SubjectHeader({ subject }: SubjectHeaderProps) {
  const getIcon = () => {
    switch (subject.icon) {
      case "Atom":
        return <Atom className="h-10 w-10 text-blue-500" />
      case "Flask":
        return <Flask className="h-10 w-10 text-green-500" />
      case "Dna":
        return <Dna className="h-10 w-10 text-red-500" />
      case "Rocket":
        return <Rocket className="h-10 w-10 text-purple-500" />
      case "Microscope":
        return <Microscope className="h-10 w-10 text-orange-500" />
      case "Zap":
        return <Zap className="h-10 w-10 text-yellow-500" />
      default:
        return <BookOpen className="h-10 w-10 text-primary" />
    }
  }

  const getColorClass = () => {
    switch (subject.color) {
      case "blue":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-500"
      case "green":
        return "bg-green-100 dark:bg-green-900/20 text-green-500"
      case "red":
        return "bg-red-100 dark:bg-red-900/20 text-red-500"
      case "purple":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-500"
      case "orange":
        return "bg-orange-100 dark:bg-orange-900/20 text-orange-500"
      case "yellow":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-500"
      default:
        return "bg-primary/10 text-primary"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/visualearn">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Subjects
          </Link>
        </Button>
      </div>

      <div className={`p-6 rounded-lg ${getColorClass()} bg-opacity-20`}>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className={`p-4 rounded-full ${getColorClass()}`}>{getIcon()}</div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{subject.title}</h1>
            <p className="text-muted-foreground mb-4">{subject.description}</p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={getColorClass()}>
                <BookOpen className="h-3 w-3 mr-1" />
                Multiple Chapters
              </Badge>
              <Badge variant="outline" className={getColorClass()}>
                <Users className="h-3 w-3 mr-1" />
                1.2k Learners
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
