"use client"

import { useTranslation } from "@/hooks/use-translation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

export default function TestimonialsSection() {
  const { t } = useTranslation()

  const testimonials = [
    {
      content: t("testimonials.1.content"),
      author: {
        name: t("testimonials.1.author.name"),
        role: t("testimonials.1.author.role"),
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
    },
    {
      content: t("testimonials.2.content"),
      author: {
        name: t("testimonials.2.author.name"),
        role: t("testimonials.2.author.role"),
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
    },
    {
      content: t("testimonials.3.content"),
      author: {
        name: t("testimonials.3.author.name"),
        role: t("testimonials.3.author.role"),
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 4,
    },
  ]

  return (
    <section className="container py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">{t("testimonials.title")}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t("testimonials.subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm italic">{testimonial.content}</p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.author.avatar || "/placeholder.svg"} alt={testimonial.author.name} />
                    <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{testimonial.author.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.author.role}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
