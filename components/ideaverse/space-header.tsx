"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Atom,
  Dna,
  FlaskRoundIcon as Flask,
  Microscope,
  Rocket,
  Zap,
  Brain,
  Users,
  MessageSquare,
  Bell,
  BellOff,
  ArrowLeft,
  TrendingUp,
  Clock,
  Star,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface SpaceHeaderProps {
  space: {
    id: string
    title: string
    description: string
    icon: string
    color: string
    members_count: number
    posts_count: number
    tags: string[]
    slug: string
  }
}

export default function SpaceHeader({ space }: SpaceHeaderProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [activeSort, setActiveSort] = useState<"trending" | "recent" | "top">("trending")
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const getIcon = () => {
    switch (space.icon) {
      case "Atom":
        return <Atom className="h-10 w-10 text-blue-500" />
      case "Dna":
        return <Dna className="h-10 w-10 text-green-500" />
      case "Flask":
        return <Flask className="h-10 w-10 text-purple-500" />
      case "Microscope":
        return <Microscope className="h-10 w-10 text-orange-500" />
      case "Rocket":
        return <Rocket className="h-10 w-10 text-red-500" />
      case "Zap":
        return <Zap className="h-10 w-10 text-yellow-500" />
      case "Brain":
        return <Brain className="h-10 w-10 text-pink-500" />
      default:
        return <MessageSquare className="h-10 w-10 text-purple-500" />
    }
  }

  const getColorClass = () => {
    switch (space.color) {
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
      case "pink":
        return "bg-pink-100 dark:bg-pink-900/20 text-pink-500"
      default:
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-500"
    }
  }

  const toggleSubscription = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe to spaces.",
        variant: "destructive",
      })
      return
    }

    setIsSubscribed(!isSubscribed)
    toast({
      title: isSubscribed ? "Unsubscribed" : "Subscribed",
      description: isSubscribed ? `You have unsubscribed from ${space.title}` : `You have subscribed to ${space.title}`,
    })
  }

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post.",
        variant: "destructive",
      })
      router.push(`/auth/login?redirect=/ideaverse/space/${space.slug}/new-post`)
      return
    }

    router.push(`/ideaverse/space/${space.slug}/new-post`)
  }

  const handleSortChange = (value: string) => {
    setActiveSort(value as "trending" | "recent" | "top")
    // Here you would typically fetch posts with the new sort order
    // For now, we'll just update the state
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/ideaverse">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to IdeaVerse
          </Link>
        </Button>
      </div>

      <div className={`p-6 rounded-lg ${getColorClass()} bg-opacity-20`}>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className={`p-4 rounded-full ${getColorClass()}`}>{getIcon()}</div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{space.title}</h1>
              <div className="flex gap-2">
                {space.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className={getColorClass()}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{space.description}</p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{(space.members_count ?? 0).toLocaleString()} members</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{(space.posts_count ?? 0).toLocaleString()} posts</span>
              </div>

              <Button
                variant={isSubscribed ? "outline" : "default"}
                onClick={toggleSubscription}
                className={isSubscribed ? getColorClass() : ""}
              >
                {isSubscribed ? (
                  <>
                    <BellOff className="h-4 w-4 mr-2" />
                    Unsubscribe
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={handleCreatePost}>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="trending" value={activeSort} onValueChange={handleSortChange}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="trending" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="top" className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Top
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </motion.div>
  )
}
