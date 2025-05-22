"use client"

import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Users, Lightbulb, BarChart, MessageSquare, Zap, Globe } from "lucide-react"
import { motion } from "framer-motion"

export default function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: t("features.visualearn.title"),
      description: t("features.visualearn.description"),
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: t("features.interactive.title"),
      description: t("features.interactive.description"),
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: t("features.ideaverse.title"),
      description: t("features.ideaverse.description"),
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: t("features.personalized.title"),
      description: t("features.personalized.description"),
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: t("features.progress.title"),
      description: t("features.progress.description"),
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: t("features.community.title"),
      description: t("features.community.description"),
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: t("features.ai.title"),
      description: t("features.ai.description"),
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: t("features.language.title"),
      description: t("features.language.description"),
    },
  ]

  return (
    <section className="container py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">{t("features.title")}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t("features.subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
