"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, MessageSquare, ThumbsUp, HelpCircle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function ProfileActivity() {
  const learningActivity = [
    {
      id: "activity-1",
      type: "topic-completed",
      title: "Completed: Newton's Laws of Motion",
      subject: "Physics",
      chapter: "Mechanics",
      date: "2 hours ago",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      id: "activity-2",
      type: "quiz-completed",
      title: "Scored 90% on Newton's Laws Quiz",
      subject: "Physics",
      chapter: "Mechanics",
      date: "2 hours ago",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "activity-3",
      type: "topic-started",
      title: "Started: Work and Energy",
      subject: "Physics",
      chapter: "Mechanics",
      date: "3 hours ago",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "activity-4",
      type: "topic-completed",
      title: "Completed: Boyle's Law",
      subject: "Chemistry",
      chapter: "Gases",
      date: "Yesterday",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      id: "activity-5",
      type: "quiz-completed",
      title: "Scored 85% on Gases Quiz",
      subject: "Chemistry",
      chapter: "Gases",
      date: "Yesterday",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
    },
  ]

  const communityActivity = [
    {
      id: "community-1",
      type: "post-created",
      title: "Posted: Understanding Quantum Entanglement",
      space: "Physics Phenomena",
      date: "1 day ago",
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
    },
    {
      id: "community-2",
      type: "comment-created",
      title: "Commented on: The Double-Slit Experiment",
      space: "Physics Phenomena",
      date: "3 days ago",
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
    },
    {
      id: "community-3",
      type: "question-answered",
      title: "Answered: How does time dilation work?",
      space: "Physics Phenomena",
      date: "1 week ago",
      icon: <HelpCircle className="h-5 w-5 text-orange-500" />,
    },
    {
      id: "community-4",
      type: "upvote-received",
      title: "Received 15 upvotes on your answer",
      space: "Physics Phenomena",
      date: "1 week ago",
      icon: <ThumbsUp className="h-5 w-5 text-green-500" />,
    },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Tabs defaultValue="learning">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="learning">Learning Activity</TabsTrigger>
          <TabsTrigger value="community">Community Activity</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="learning">
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Journey</CardTitle>
                <CardDescription>Track your progress through courses, topics, and quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {learningActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <div className="bg-muted p-2 rounded-full h-10 w-10 flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{activity.subject}</Badge>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{activity.chapter}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community">
            <Card>
              <CardHeader>
                <CardTitle>Your Community Interactions</CardTitle>
                <CardDescription>Your posts, comments, and contributions to the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {communityActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <div className="bg-muted p-2 rounded-full h-10 w-10 flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{activity.space}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  )
}
