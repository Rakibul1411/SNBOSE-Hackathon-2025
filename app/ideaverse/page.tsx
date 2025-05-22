import type { Metadata } from "next"
import ForumHeader from "@/components/ideaverse/forum-header"
import SpaceGrid from "@/components/ideaverse/space-grid"
import TrendingPosts from "@/components/ideaverse/trending-posts"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "IdeaVerse - Biplobi-Biggan-Sikhkha",
  description: "Community forum for scientific discussions and knowledge sharing",
}

export default function IdeaVersePage() {
  return (
    <div className="container py-8">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </Button>
      </div>
      <ForumHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Popular Spaces</h2>
          <SpaceGrid />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Trending Discussions</h2>
          <TrendingPosts />
        </div>
      </div>
    </div>
  )
}
