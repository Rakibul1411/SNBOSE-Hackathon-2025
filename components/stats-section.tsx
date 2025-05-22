"use client"

import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { BookOpen, Users, GraduationCap, FileText } from "lucide-react"

export default function StatsSection() {
  const { t } = useTranslation()

  const stats = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      value: "500+",
      label: t("stats.topics"),
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      value: "10,000+",
      label: t("stats.users"),
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      value: "95%",
      label: t("stats.satisfaction"),
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      value: "5,000+",
      label: t("stats.discussions"),
    },
  ]

  return (
    <section className="bg-primary/5 py-16">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-none bg-background/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4">{stat.icon}</div>
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
