import type { Metadata } from "next"
import { notFound } from "next/navigation"
import TopicContent from "@/components/visualearn/topic-content"
import TopicNavigation from "@/components/visualearn/topic-navigation"

interface TopicPageProps {
  params: {
    subject: string
    chapter: string
    topic: string
  }
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { subject, chapter, topic } = params;
  const topicData = getTopicData(subject, chapter, topic);

  if (!topicData) {
    return {
      title: "Topic Not Found",
    }
  }

  return {
    title: `${topicData.title} - ${topicData.chapter} - ${topicData.subject}`,
    description: topicData.description,
  }
}

function getTopicData(subjectId: string, chapterId: string, topicId: string) {
  // This would typically come from a database
  if (subjectId === "physics" && chapterId === "mechanics" && topicId === "newtons-laws") {
    return {
      id: "newtons-laws",
      subject: "Physics",
      chapter: "Mechanics",
      title: "Newton's Laws of Motion",
      description:
        "Fundamental principles that describe the relationship between an object and the forces acting on it",
      content:
        "Newton's laws of motion are three physical laws that form the basis for classical mechanics. They describe the relationship between the motion of an object and the forces acting on it.",
      hasSimulation: true,
      hasQuiz: true,
      nextTopic: "work-energy",
      prevTopic: "kinematics",
    }
  }

  if (subjectId === "chemistry" && chapterId === "gases" && topicId === "boyles-law") {
    return {
      id: "boyles-law",
      subject: "Chemistry",
      chapter: "Gases",
      title: "Boyle's Law",
      description: "Relationship between pressure and volume of a gas at constant temperature",
      content:
        "Boyle's law states that the pressure of a given mass of an ideal gas is inversely proportional to its volume at a constant temperature.",
      hasSimulation: true,
      hasQuiz: true,
      nextTopic: "charles-law",
      prevTopic: "gas-properties",
    }
  }

  // Default fallback for demo purposes
  return {
    id: topicId,
    subject: subjectId.charAt(0).toUpperCase() + subjectId.slice(1),
    chapter: chapterId.charAt(0).toUpperCase() + chapterId.slice(1),
    title: topicId.charAt(0).toUpperCase() + topicId.slice(1).replace(/-/g, " "),
    description: `Topic on ${topicId} in ${chapterId} of ${subjectId}`,
    content: "Content for this topic will be available soon.",
    hasSimulation: false,
    hasQuiz: false,
    nextTopic: null,
    prevTopic: null,
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { subject, chapter, topic } = params;
  const topicData = getTopicData(subject, chapter, topic);

  if (!topicData) {
    notFound();
  }

  return (
    <div className="container py-8">
      <TopicNavigation subject={subject} chapter={chapter} topic={topicData} />
      <TopicContent subject={subject} chapter={chapter} topic={topicData} />
    </div>
  );
}
