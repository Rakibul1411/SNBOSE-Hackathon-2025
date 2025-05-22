"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, TrendingUp, Clock, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

export default function ForumHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/ideaverse/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleCreateSpace = () => {
    if (isAuthenticated) {
      router.push("/ideaverse/create-space")
    } else {
      toast({
        title: "Authentication required",
        description: "Please log in to create a space.",
        variant: "destructive",
      })
      router.push("/auth/login?redirect=/ideaverse/create-space")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">IdeaVerse</h1>
            <p className="text-muted-foreground">
              Join discussions, ask questions, and share knowledge with the community
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCreateSpace}>
              <Plus className="h-4 w-4 mr-2" />
              Create Space
            </Button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for spaces, discussions, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-20"
          />
          <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8">
            Search
          </Button>
        </form>

        <Tabs defaultValue="popular">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="popular" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="following" className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Following
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </motion.div>
  )
}
