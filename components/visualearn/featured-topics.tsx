"use client"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"

export default function FeaturedTopics() {
  const { t } = useTranslation()

  const featuredTopics = [
    {
      id: "pendulum",
      title: "Simple Pendulum",
      subject: "Physics",
      description: "Explore the motion of a pendulum and understand the principles of simple harmonic motion",
      difficulty: "Intermediate",
      image: "/placeholder.svg?height=150&width=300",
      path: "/visualearn/physics/mechanics/pendulum",
    },
    {
      id: "dna",
      title: "DNA Replication",
      subject: "Biology",
      description: "Visualize how DNA replicates and understand the molecular mechanisms involved",
      difficulty: "Advanced",
      image: "/placeholder.svg?height=150&width=300",
      path: "/visualearn/biology/genetics/dna-replication",
    },
    {
      id: "boyle",
      title: "Boyle's Law",
      subject: "Chemistry",
      description: "Understand the relationship between pressure and volume in gases through interactive simulations",
      difficulty: "Beginner",
      image: "/placeholder.svg?height=150&width=300",
      path: "/visualearn/chemistry/gases/boyles-law",
    },
  ]

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-primary" />
          Featured Topics
        </h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/visualearn/featured">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={topic.image || "/placeholder.svg"}
                  alt={topic.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">{topic.subject}</Badge>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                    {topic.difficulty}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{topic.title}</CardTitle>
                <CardDescription className="line-clamp-2">{topic.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full" variant="default">
                  <Link href={topic.path}>
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
