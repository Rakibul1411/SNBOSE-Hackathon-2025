import type { Metadata } from "next"
import CreateSpaceForm from "@/components/ideaverse/create-space-form"
import ProtectedRoute from "@/components/auth/protected-route"

export const metadata: Metadata = {
  title: "Create Space - IdeaVerse",
  description: "Create a new space in IdeaVerse",
}

export default function CreateSpacePage() {
  return (
    <ProtectedRoute>
      <div className="container py-8">
        <CreateSpaceForm />
      </div>
    </ProtectedRoute>
  )
} 