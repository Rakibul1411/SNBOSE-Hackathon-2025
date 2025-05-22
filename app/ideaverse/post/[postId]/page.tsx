import type { Metadata } from "next"
import { notFound } from "next/navigation"
import PostDetail from "@/components/ideaverse/post-detail"
import CommentSection from "@/components/ideaverse/comment-section"
import RelatedPosts from "@/components/ideaverse/related-posts"

interface PostPageProps {
  params: {
    postId: string
  }
}
// export async function generateMetadata({ params }: NewPostPageProps): Promise<Metadata> {
  //const spaceData = await getSpaceBySlug(params.spaceId)

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const postData = getPostData(params.postId)

  if (!postData) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${postData.title} - IdeaVerse`,
    description: postData.content.substring(0, 160),
  }
}

function getPostData(postId: string) {
  // This would typically come from a database
  if (postId === "quantum-entanglement") {
    return {
      id: "quantum-entanglement",
      title: "Understanding Quantum Entanglement",
      content:
        "I've been trying to understand quantum entanglement, but I'm struggling with the concept. Can someone explain it in simple terms?\n\nFrom what I understand, when two particles become entangled, the quantum state of each particle cannot be described independently of the state of the other. But how does this work across large distances? And what are the implications for information transfer?\n\nI've read about the EPR paradox and Bell's inequalities, but I'm still confused about the practical applications and what this means for our understanding of reality.",
      author: {
        name: "Dr. Alex Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      space: {
        id: "physics-phenomena",
        title: "Physics Phenomena",
      },
      comments: 42,
      likes: 128,
      dislikes: 5,
      views: 1543,
      tags: ["Quantum", "Physics"],
      timeAgo: "2 hours ago",
      type: "question",
      created: "2023-05-15T14:30:00Z",
    }
  }

  // Default fallback for demo purposes
  return {
    id: postId,
    title: "Sample Post",
    content: "This is a sample post content...",
    author: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    space: {
      id: "sample-space",
      title: "Sample Space",
    },
    comments: 10,
    likes: 25,
    dislikes: 1,
    views: 300,
    tags: ["Sample", "Demo"],
    timeAgo: "1 day ago",
    type: "discussion",
    created: "2023-05-10T10:00:00Z",
  }
}

export default function PostPage({ params }: PostPageProps) {
  const postData = getPostData(params.postId)

  if (!postData) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PostDetail post={postData} />
          <CommentSection postId={params.postId} />
        </div>

        <div>
          <RelatedPosts spaceId={postData.space.id} currentPostId={params.postId} tags={postData.tags} />
        </div>
      </div>
    </div>
  )
}
