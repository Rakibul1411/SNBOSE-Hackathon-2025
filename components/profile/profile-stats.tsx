"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle, Award, BarChart } from "lucide-react"
import { motion } from "framer-motion"

export default function ProfileStats() {
  const learningStats = {
    chaptersCompleted: 12,
    totalChapters: 45,
    topicsCompleted: 37,
    totalTopics: 156,
    quizzesCompleted: 28,
    totalQuizzes: 78,
    questionsAnswered: 142,
    upvotesReceived: 87,
    hoursSpent: 24,
    streak: 7,
  }

  const subjectProgress = [
    {
      subject: "Physics",
      progress: 65,
      color: "bg-blue-500",
    },
    {
      subject: "Chemistry",
      progress: 40,
      color: "bg-green-500",
    },
    {
      subject: "Biology",
      progress: 25,
      color: "bg-red-500",
    },
    {
      subject: "Astronomy",
      progress: 50,
      color: "bg-purple-500",
    },
  ]

  const recentAchievements = [
    {
      title: "Physics Explorer",
      description: "Completed 10 physics topics",
      date: "2 days ago",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Quiz Master",
      description: "Scored 100% on 5 quizzes",
      date: "1 week ago",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Helpful Contributor",
      description: "Received 50 upvotes on your answers",
      date: "2 weeks ago",
      icon: <Award className="h-5 w-5 text-yellow-500" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Learning Progress
            </CardTitle>
            <CardDescription>Your overall learning statistics and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Chapters Completed</span>
                <span className="font-medium">
                  {learningStats.chaptersCompleted}/{learningStats.totalChapters}
                </span>
              </div>
              <Progress value={(learningStats.chaptersCompleted / learningStats.totalChapters) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Topics Completed</span>
                <span className="font-medium">
                  {learningStats.topicsCompleted}/{learningStats.totalTopics}
                </span>
              </div>
              <Progress value={(learningStats.topicsCompleted / learningStats.totalTopics) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quizzes Completed</span>
                <span className="font-medium">
                  {learningStats.quizzesCompleted}/{learningStats.totalQuizzes}
                </span>
              </div>
              <Progress value={(learningStats.quizzesCompleted / learningStats.totalQuizzes) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-muted rounded-md p-3 text-center">
                <div className="text-2xl font-bold">{learningStats.questionsAnswered}</div>
                <div className="text-xs text-muted-foreground">Questions Answered</div>
              </div>
              <div className="bg-muted rounded-md p-3 text-center">
                <div className="text-2xl font-bold">{learningStats.upvotesReceived}</div>
                <div className="text-xs text-muted-foreground">Upvotes Received</div>
              </div>
              <div className="bg-muted rounded-md p-3 text-center">
                <div className="text-2xl font-bold">{learningStats.hoursSpent}</div>
                <div className="text-xs text-muted-foreground">Hours Spent</div>
              </div>
              <div className="bg-muted rounded-md p-3 text-center">
                <div className="text-2xl font-bold">{learningStats.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Subject Progress
              </CardTitle>
              <CardDescription>Your progress across different subjects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjectProgress.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{subject.subject}</span>
                    <span className="font-medium">{subject.progress}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${subject.color} rounded-full`} style={{ width: `${subject.progress}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Recent Achievements
              </CardTitle>
              <CardDescription>Your latest learning milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-muted p-2 rounded-full">{achievement.icon}</div>
                  <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
