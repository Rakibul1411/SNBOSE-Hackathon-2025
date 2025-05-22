import type { Metadata } from "next"
import { notFound } from "next/navigation"
import SpaceHeader from "@/components/ideaverse/space-header"
import PostList from "@/components/ideaverse/post-list"
import SpaceSidebar from "@/components/ideaverse/space-sidebar"
import { getSpaceBySlug } from "@/actions/forum-actions"

interface SpacePageProps {
  params: {
    spaceId: string
  }
}

export async function generateMetadata({ params }: SpacePageProps): Promise<Metadata> {
  const spaceData = await getSpaceBySlug(params.spaceId)

  console.log("Space data for metadata:", params.spaceId)

  if (!spaceData) {
    return {
      title: "Space Not Found",
    }
  }

  return {
    title: `${spaceData.title} - IdeaVerse`,
    description: spaceData.description || "",
  }
}

export default async function SpacePage({ params }: SpacePageProps) {
  const spaceData = await getSpaceBySlug(params.spaceId)

  if (!spaceData) {
    notFound()
  }

  return (
    <div className="container py-8">
      <SpaceHeader space={spaceData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <PostList spaceId={params.spaceId} />
        </div>

        <div>
          <SpaceSidebar space={spaceData} />
        </div>
      </div>
    </div>
  )
}
