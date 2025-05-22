"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <>
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background z-0" />
        <div className="container relative z-10 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {t("hero.title.part1")} <span className="text-primary">{t("hero.title.part2")}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">{t("hero.description")}</p>
              <div className="flex flex-row items-center gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/visualearn">
                    {t("hero.cta.primary")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/ideaverse">{t("hero.cta.secondary")}</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-[300px] lg:h-[350px] rounded-lg overflow-hidden shadow-xl flex items-center justify-center"
            >
              <div className="absolute inset-0 from-primary/20 via-background/50 to-background/20 z-10" />
              <img
                src="/profile.jpg?height=600&width=600"
                alt="Learning platform illustration"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
