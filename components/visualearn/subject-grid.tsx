"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Atom, Dna, FlaskRoundIcon as Flask, Microscope, Rocket, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"

export default function SubjectGrid() {
  const { t } = useTranslation()

  const subjects = [
    {
      id: "physics",
      title: "Physics",
      description: "Explore motion, forces, energy, and the fundamental laws of the universe",
      icon: <Atom className="h-8 w-8 text-blue-500" />,
      topics: 42,
      color: "bg-blue-100 dark:bg-blue-900/20",
      textColor: "text-blue-500",
    },
    {
      id: "chemistry",
      title: "Chemistry",
      description: "Discover elements, compounds, reactions, and the building blocks of matter",
      icon: <Flask className="h-8 w-8 text-green-500" />,
      topics: 38,
      color: "bg-green-100 dark:bg-green-900/20",
      textColor: "text-green-500",
    },
    {
      id: "biology",
      title: "Biology",
      description: "Learn about living organisms, ecosystems, genetics, and human anatomy",
      icon: <Dna className="h-8 w-8 text-red-500" />,
      topics: 45,
      color: "bg-red-100 dark:bg-red-900/20",
      textColor: "text-red-500",
    },
    {
      id: "astronomy",
      title: "Astronomy",
      description: "Journey through space to understand planets, stars, galaxies, and cosmic phenomena",
      icon: <Rocket className="h-8 w-8 text-purple-500" />,
      topics: 28,
      color: "bg-purple-100 dark:bg-purple-900/20",
      textColor: "text-purple-500",
    },
    {
      id: "medical",
      title: "Medical Science",
      description: "Explore human health, diseases, treatments, and medical technologies",
      icon: <Microscope className="h-8 w-8 text-orange-500" />,
      topics: 36,
      color: "bg-orange-100 dark:bg-orange-900/20",
      textColor: "text-orange-500",
    },
    {
      id: "electronics",
      title: "Electronics",
      description: "Understand circuits, components, and the principles of electronic systems",
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      topics: 32,
      color: "bg-yellow-100 dark:bg-yellow-900/20",
      textColor: "text-yellow-500",
    },
    {
      id: "architecture",
      title: "Architectures",
      description: "Design civilization, monuments and spectacles",
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      topics: 12,
      color: "bg-violet-100 dark:bg-yellow-900/20",
      textColor: "text-violet-500",
    },

  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject, index) => (
        <motion.div
          key={subject.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="h-full overflow-hidden transition-all hover:shadow-md">
            <CardHeader className={`${subject.color}`}>
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-lg ${subject.color}`}>{subject.icon}</div>
                <Badge variant="outline" className={subject.textColor}>
                  {subject.topics} topics
                </Badge>
              </div>
              <CardTitle className="mt-2">{subject.title}</CardTitle>
              <CardDescription>{subject.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm font-medium">Popular chapters:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {subject.id === "physics" && (
                    <>
                      <li>• Motion and Forces</li>
                      <li>• Energy and Work</li>
                      <li>• Thermodynamics</li>
                    </>
                  )}
                  {subject.id === "chemistry" && (
                    <>
                      <li>• Atomic Structure</li>
                      <li>• Chemical Bonding</li>
                      <li>• Organic Chemistry</li>
                    </>
                  )}
                  {subject.id === "biology" && (
                    <>
                      <li>• Cell Biology</li>
                      <li>• Genetics</li>
                      <li>• Human Physiology</li>
                    </>
                  )}
                  {subject.id === "astronomy" && (
                    <>
                      <li>• Solar System</li>
                      <li>• Stars and Galaxies</li>
                      <li>• Cosmology</li>
                    </>
                  )}
                  {subject.id === "medical" && (
                    <>
                      <li>• Anatomy</li>
                      <li>• Immunology</li>
                      <li>• Pharmacology</li>
                    </>
                  )}
                  {subject.id === "electronics" && (
                    <>
                      <li>• Circuit Analysis</li>
                      <li>• Digital Electronics</li>
                      <li>• Microcontrollers</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className={`w-full ${subject.textColor}`} variant="ghost">
                <Link href={`/visualearn/${subject.id}`}>
                  Explore {subject.title}
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
