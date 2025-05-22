import type { Metadata } from "next"
import { notFound } from "next/navigation"
import TopicList from "@/components/visualearn/topic-list"
import ChapterHeader from "@/components/visualearn/chapter-header"

interface ChapterPageProps {
  params: {
    subject: string
    chapter: string
  }
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { subject, chapter } = params;
  const chapterData = getChapterData(subject, chapter);

  if (!chapterData) {
    return {
      title: "Chapter Not Found",
    }
  }

  return {
    title: `${chapterData.title} - ${chapterData.subject}`,
    description: chapterData.description,
  }
}

function getChapterData(subjectId: string, chapterId: string) {
  // This would typically come from a database
  if (subjectId === "physics" && chapterId === "mechanics") {
    return {
      id: "mechanics",
      subject: "Physics",
      title: "Mechanics",
      description: "Study of motion, forces, energy, and the fundamental principles of classical mechanics",
      topics: 8,
    }
  }

  if (subjectId === "chemistry" && chapterId === "gases") {
    return {
      id: "gases",
      subject: "Chemistry",
      title: "Gases and Gas Laws",
      description: "Explore the behavior of gases and the laws that govern them",
      topics: 4,
    }
  }

  // Default fallback for demo purposes
  return {
    id: chapterId,
    subject: subjectId.charAt(0).toUpperCase() + subjectId.slice(1),
    title: chapterId.charAt(0).toUpperCase() + chapterId.slice(1),
    description: `Chapter on ${chapterId} in ${subjectId}`,
    topics: 5,
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { subject, chapter } = params;
  const chapterData = getChapterData(subject, chapter);

  if (!chapterData) {
    notFound();
  }

  return (
    <div className="container py-8">
      <ChapterHeader subject={subject} chapter={chapterData} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Topics</h2>
        <TopicList subjectId={subject} chapterId={chapter} />
      </div>
    </div>
  );
}
