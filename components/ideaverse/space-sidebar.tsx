"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Users, Calendar, Info, MessageSquare, ArrowRight } from "lucide-react"
import type { Space } from "@/types/database"

interface SpaceSidebarProps {
  space: Space
}

export default function SpaceSidebar({ space }: SpaceSidebarProps) {
  const topContributors = [
    {
      name: "Dr. Alex Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 87,
      joined: "1 year ago",
    },
    {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 64,
      joined: "8 months ago",
    },
    {
      name: "Prof. Richard Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 52,
      joined: "1 year ago",
    },
    {
      name: "Michael Wong",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 43,
      joined: "6 months ago",
    },
    {
      name: "Dr. Emily Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 38,
      joined: "9 months ago",
    },
  ]

  const upcomingEvents = [
    {
      id: "event-1",
      title: "Live Q&A Session",
      date: "Tomorrow, 3:00 PM",
      participants: 24,
    },
    {
      id: "event-2",
      title: "Monthly Discussion",
      date: "Next Monday, 5:00 PM",
      participants: 42,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About this Space</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{space.members_count?.toLocaleString() || 0} members</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Created {new Date(space.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span>~50 posts per week</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span>Moderated by 3 experts</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/ideaverse/space/${space.id}/about`}>
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Contributors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topContributors.map((contributor, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} />
                  <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{contributor.name}</p>
                  <p className="text-xs text-muted-foreground">Joined {contributor.joined}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{contributor.posts} posts</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="space-y-2">
              <h3 className="font-medium">{event.title}</h3>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{event.participants} going</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                Join Event
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" asChild>
            <Link href={`/ideaverse/space/${space.id}/events`}>
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
