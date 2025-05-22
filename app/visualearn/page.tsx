import type { Metadata } from "next"
import SubjectGrid from "@/components/visualearn/subject-grid"
import SearchBar from "@/components/visualearn/search-bar"
import FeaturedTopics from "@/components/visualearn/featured-topics"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "VisualLearn - Interactive Learning Platform",
  description: "Interactive visual learning platform for science subjects",
}

export default function VisualEarnPage() {
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
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-4">VisualEarn</h1>
        <p className="text-muted-foreground mb-6">
          Explore interactive visualizations and simulations to understand complex scientific concepts. Search for topics or browse by subject to start your learning journey.
        </p>
        <SearchBar />
      </div>

      <FeaturedTopics />

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Subject</h2>
        <SubjectGrid />
      </div>
    </div>
  )
}
