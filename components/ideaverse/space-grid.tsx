"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Users, MessageSquare, Atom, Dna, FlaskRoundIcon as Flask, Rocket, Zap, Brain } from "lucide-react"
import { motion } from "framer-motion"
import { getSpaces } from "@/actions/forum-actions"
import { useToast } from "@/components/ui/use-toast"
import type { Space } from "@/types/database"

export default function SpaceGrid() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        console.log("SERVER-SIDE: Fetching spaces...")
        const spacesData = await getSpaces()
        console.log("----------Fetched spaces:---------", spacesData)
        setSpaces(spacesData || [])
      } catch (error) {
        console.error("Error fetching spaces:", error)
        toast({
          title: "Error",
          description: "Failed to load spaces. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpaces()
  }, [toast])

  console.log("------CLIENT-SIDE: Spaces state:-------", spaces)

  // Fallback spaces if database is empty or loading
  const fallbackSpaces = [
    {
      id: "physics-phenomena",
      title: "Physics Phenomena",
      description: "Discuss interesting physics phenomena and their explanations",
      icon: "Atom",
      color: "blue",
      members_count: 1245,
      posts_count: 328,
      tags: ["Physics", "Phenomena", "Explanations"],
      slug: "physics-phenomena",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "",
    },
    {
      id: "molecular-biology",
      title: "Molecular Biology",
      description: "Explore the world of DNA, RNA, proteins, and cellular processes",
      icon: "Dna",
      color: "green",
      members_count: 987,
      posts_count: 256,
      tags: ["Biology", "Molecular", "Genetics"],
      slug: "molecular-biology",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "",
    },
    // Add more fallback spaces as needed
  ]

  const spacesToDisplay = isLoading || spaces.length === 0 ? fallbackSpaces : spaces

  const getSpaceIcon = (iconName: string | null) => {
    switch (iconName) {
      case "Atom":
        return <Atom className="h-8 w-8 text-blue-500" />
      case "Dna":
        return <Dna className="h-8 w-8 text-green-500" />
      case "Flask":
        return <Flask className="h-8 w-8 text-purple-500" />
      case "Rocket":
        return <Rocket className="h-8 w-8 text-orange-500" />
      case "Brain":
        return <Brain className="h-8 w-8 text-red-500" />
      case "Zap":
        return <Zap className="h-8 w-8 text-yellow-500" />
      default:
        return <MessageSquare className="h-8 w-8 text-purple-500" />
    }
  }

  const getColorClass = (colorName: string | null) => {
    switch (colorName) {
      case "blue":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-500"
      case "green":
        return "bg-green-100 dark:bg-green-900/20 text-green-500"
      case "purple":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-500"
      case "orange":
        return "bg-orange-100 dark:bg-orange-900/20 text-orange-500"
      case "red":
        return "bg-red-100 dark:bg-red-900/20 text-red-500"
      case "yellow":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-500"
      default:
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-500"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {spacesToDisplay.map((space, index) => (
        <motion.div
          key={space.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="h-full overflow-hidden transition-all hover:shadow-md">
            <CardHeader className={getColorClass(space.color)}>
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-lg ${getColorClass(space.color)}`}>
                  {getSpaceIcon(space.icon)}
                </div>
                <div className="flex gap-2">
                  {(space.tags ?? []).slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className={getColorClass(space.color)}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardTitle className="mt-2">{space.title}</CardTitle>
              <CardDescription>{space.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{(space.members_count ?? 0).toLocaleString()} members</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{(space.posts_count ?? 0).toLocaleString()} posts</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild className={`w-full ${getColorClass(space.color)}`} variant="ghost">
                <Link href={`/ideaverse/space/${space.slug}`}>
                  Visit Space
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
