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


export async function generateMetadata(
 { params }: { params: Promise<{ spaceId: string }> }
): Promise<Metadata> {
 const { spaceId } = await params;
  const spaceData = await getSpaceBySlug(spaceId)
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


export default async function Page({ params }: { params: Promise<{ spaceId: string }> }) {
 const { spaceId } = await params;




 // const { resolvedParams } = await params;
 //const { spaceId }= await params.spaceId;
 // const { spaceId }=  React.use(params.spaceId)
 // const { spaceId } = await params
 console.log("Hello slug -- ", spaceId);
 // const spaceId = params.spaceId;
  const spaceData = await getSpaceBySlug(spaceId)
  if (!spaceData) {
   notFound()
 }
  return (
   <div className="flex flex-col min-h-screen">
     <SpaceHeader space={spaceData} />
     <div className="flex flex-1 gap-4 p-4">
       <PostList spaceId={spaceData.id} />
       <SpaceSidebar space={spaceData} />
     </div>
   </div>
 )
}
