"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function ProfileHeader() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your profile.</p>
        <Button asChild>
          <a href="/auth/login">Log In</a>
        </Button>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="mb-4">
        <Button variant="ghost" asChild className="pl-0">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage
              src={user.profile?.avatar_url || "/placeholder.svg?height=128&width=128"}
              alt={user.profile?.full_name || ""}
            />
            <AvatarFallback className="text-3xl">
              {user.profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit profile picture</span>
          </Button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{user.profile?.full_name || user.email}</h1>
              <p className="text-muted-foreground">{user.email}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge variant="outline">Science Enthusiast</Badge>
                <Badge variant="outline">Physics Lover</Badge>
                <Badge variant="outline">Active Learner</Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/profile/edit">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>

          <div className="mt-4 max-w-2xl">
            <p className="text-sm">
              {user.profile?.bio ||
                "Science enthusiast with a passion for physics and astronomy. I love learning about new scientific discoveries and sharing knowledge with others."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
