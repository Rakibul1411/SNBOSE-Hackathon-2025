import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ChapterList from "@/components/visualearn/chapter-list"
import SubjectHeader from "@/components/visualearn/subject-header"

interface SubjectPageProps {
  params: {
    subject: string
  }
}

export async function generateMetadata({ params }: SubjectPageProps): Promise<Metadata> {
  const { subject } = params;
  const subjectData = getSubjectData(subject);

  if (!subjectData) {
    return {
      title: "Subject Not Found",
    }
  }

  return {
    title: `${subjectData.title} - VisualEarn`,
    description: subjectData.description,
  }
}

function getSubjectData(subjectId: string) {
  const subjects = {
    physics: {
      id: "physics",
      title: "Physics",
      description: "Explore motion, forces, energy, and the fundamental laws of the universe",
      icon: "Atom",
      color: "blue",
    },
    chemistry: {
      id: "chemistry",
      title: "Chemistry",
      description: "Discover elements, compounds, reactions, and the building blocks of matter",
      icon: "Flask",
      color: "green",
    },
    biology: {
      id: "biology",
      title: "Biology",
      description: "Learn about living organisms, ecosystems, genetics, and human anatomy",
      icon: "Dna",
      color: "red",
    },
    astronomy: {
      id: "astronomy",
      title: "Astronomy",
      description: "Journey through space to understand planets, stars, galaxies, and cosmic phenomena",
      icon: "Rocket",
      color: "purple",
    },
    medical: {
      id: "medical",
      title: "Medical Science",
      description: "Explore human health, diseases, treatments, and medical technologies",
      icon: "Microscope",
      color: "orange",
    },
    electronics: {
      id: "electronics",
      title: "Electronics",
      description: "Understand circuits, components, and the principles of electronic systems",
      icon: "Zap",
      color: "yellow",
    },
  }

  return subjects[subjectId as keyof typeof subjects]
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject } = params;
  const subjectData = getSubjectData(subject);

  if (!subjectData) {
    notFound();
  }

  return (
    <div className="container py-8">
      <SubjectHeader subject={subjectData} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Chapters</h2>
        <ChapterList subjectId={subject} />
      </div>
    </div>
  )
}
