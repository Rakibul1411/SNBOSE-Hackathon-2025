import type { Metadata } from "next"
import { notFound } from "next/navigation"
import CreatePostForm from "@/components/ideaverse/create-post-form"
import ProtectedRoute from "@/components/auth/protected-route"
import { getSpaceBySlug } from "@/actions/forum-actions"


interface NewPostPageProps {
 params: {
   spaceId: string
 }
}


export async function generateMetadata({ params }: NewPostPageProps): Promise<Metadata> {
 const spaceId = params.spaceId;
 const spaceData = await getSpaceBySlug(spaceId);


 if (!spaceData) {
   return {
     title: "Space Not Found",
   }
 }


 return {
   title: `New Post in ${spaceData.title} - IdeaVerse`,
   description: `Create a new post in ${spaceData.title}`,
 }
}


export default async function NewPostPage({ params }: NewPostPageProps) {
 const spaceId = params.spaceId;
 const spaceData = await getSpaceBySlug(spaceId);


 console.log("New Post Page - Space ID: -------------------", spaceData.title);


 if (!spaceData) {
   notFound()
 }


 return (
   <ProtectedRoute>
     <div className="container py-8">
       <CreatePostForm spaceId={spaceData.id} spaceName={spaceData.title} />
     </div>
   </ProtectedRoute>
 )
}
