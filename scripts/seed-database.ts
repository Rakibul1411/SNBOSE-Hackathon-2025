"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function seedDatabase() {
  const supabase = createServerSupabaseClient()

  // Seed spaces
  const spaces = [
    {
      slug: "physics-phenomena",
      title: "Physics Phenomena",
      description: "Discuss interesting physics phenomena and their explanations",
      icon: "Atom",
      color: "blue",
    },
    {
      slug: "molecular-biology",
      title: "Molecular Biology",
      description: "Explore the world of DNA, RNA, proteins, and cellular processes",
      icon: "Dna",
      color: "green",
    },
    {
      slug: "chemistry-experiments",
      title: "Chemistry Experiments",
      description: "Share and discuss interesting chemistry experiments and results",
      icon: "Flask",
      color: "purple",
    },
    {
      slug: "space-exploration",
      title: "Space Exploration",
      description: "Discuss the latest in space exploration, astronomy, and cosmology",
      icon: "Rocket",
      color: "orange",
    },
    {
      slug: "neuroscience",
      title: "Neuroscience",
      description: "Explore the fascinating world of the brain and nervous system",
      icon: "Brain",
      color: "red",
    },
    {
      slug: "electronics-diy",
      title: "Electronics & DIY",
      description: "Share your electronics projects, circuits, and DIY science experiments",
      icon: "Zap",
      color: "yellow",
    },
  ]

  const { error: spacesError } = await supabase.from("spaces").upsert(spaces, { onConflict: "slug" })

  if (spacesError) {
    console.error("Error seeding spaces:", spacesError)
    throw new Error("Failed to seed spaces")
  }

  // Seed subjects
  const subjects = [
    {
      slug: "physics",
      title: "Physics",
      description: "Explore motion, forces, energy, and the fundamental laws of the universe",
      icon: "Atom",
      color: "blue",
    },
    {
      slug: "chemistry",
      title: "Chemistry",
      description: "Discover elements, compounds, reactions, and the building blocks of matter",
      icon: "Flask",
      color: "green",
    },
    {
      slug: "biology",
      title: "Biology",
      description: "Learn about living organisms, ecosystems, genetics, and human anatomy",
      icon: "Dna",
      color: "red",
    },
    {
      slug: "astronomy",
      title: "Astronomy",
      description: "Journey through space to understand planets, stars, galaxies, and cosmic phenomena",
      icon: "Rocket",
      color: "purple",
    },
    {
      slug: "medical",
      title: "Medical Science",
      description: "Explore human health, diseases, treatments, and medical technologies",
      icon: "Microscope",
      color: "orange",
    },
    {
      slug: "electronics",
      title: "Electronics",
      description: "Understand circuits, components, and the principles of electronic systems",
      icon: "Zap",
      color: "yellow",
    },
  ]

  const { error: subjectsError } = await supabase.from("subjects").upsert(subjects, { onConflict: "slug" })

  if (subjectsError) {
    console.error("Error seeding subjects:", subjectsError)
    throw new Error("Failed to seed subjects")
  }

  // Get subject IDs
  const { data: subjectData, error: subjectFetchError } = await supabase.from("subjects").select("id, slug")

  if (subjectFetchError) {
    console.error("Error fetching subjects:", subjectFetchError)
    throw new Error("Failed to fetch subjects")
  }

  const subjectMap = subjectData.reduce(
    (map, subject) => {
      map[subject.slug] = subject.id
      return map
    },
    {} as Record<string, string>,
  )

  // Seed chapters for physics
  const physicsChapters = [
    {
      subject_id: subjectMap.physics,
      slug: "mechanics",
      title: "Mechanics",
      description: "Study of motion, forces, energy, and the fundamental principles of classical mechanics",
      image_url: "/placeholder.svg?height=120&width=240",
    },
    {
      subject_id: subjectMap.physics,
      slug: "thermodynamics",
      title: "Thermodynamics",
      description: "Explore heat, temperature, energy, and the laws governing thermal systems",
      image_url: "/placeholder.svg?height=120&width=240",
    },
    {
      subject_id: subjectMap.physics,
      slug: "waves",
      title: "Waves and Oscillations",
      description: "Understand wave phenomena, sound, light, and periodic motion",
      image_url: "/placeholder.svg?height=120&width=240",
    },
  ]

  const { error: physicsChaptersError } = await supabase
    .from("chapters")
    .upsert(physicsChapters, { onConflict: "subject_id, slug" })

  if (physicsChaptersError) {
    console.error("Error seeding physics chapters:", physicsChaptersError)
    throw new Error("Failed to seed physics chapters")
  }

  // Get chapter IDs
  const { data: chapterData, error: chapterFetchError } = await supabase.from("chapters").select("id, slug, subject_id")

  if (chapterFetchError) {
    console.error("Error fetching chapters:", chapterFetchError)
    throw new Error("Failed to fetch chapters")
  }

  const mechanicsChapter = chapterData.find(
    (chapter) => chapter.slug === "mechanics" && chapter.subject_id === subjectMap.physics,
  )

  if (!mechanicsChapter) {
    throw new Error("Mechanics chapter not found")
  }

  // Seed topics for mechanics
  const mechanicsTopics = [
    {
      chapter_id: mechanicsChapter.id,
      slug: "kinematics",
      title: "Kinematics",
      description: "Study of motion without considering its causes",
      content:
        "Kinematics is the branch of classical mechanics that describes the motion of points, bodies, and systems of bodies without considering the forces that cause them to move. Kinematics focuses on the geometric and time-based aspects of motion.",
      difficulty: "Beginner",
      duration: 25,
      has_simulation: true,
      has_quiz: true,
    },
    {
      chapter_id: mechanicsChapter.id,
      slug: "newtons-laws",
      title: "Newton's Laws of Motion",
      description:
        "Fundamental principles that describe the relationship between an object and the forces acting on it",
      content:
        "Newton's laws of motion are three physical laws that form the basis for classical mechanics. They describe the relationship between the motion of an object and the forces acting on it. These laws have been verified by countless experiments and observations over centuries.",
      difficulty: "Beginner",
      duration: 30,
      has_simulation: true,
      has_quiz: true,
    },
    {
      chapter_id: mechanicsChapter.id,
      slug: "work-energy",
      title: "Work and Energy",
      description: "Understanding work, energy, and the relationship between them",
      content:
        "Work and energy are fundamental concepts in physics. Work is the energy transferred to or from an object via the application of force along a displacement. Energy is the capacity for doing work. The work-energy theorem states that the work done by all forces acting on a particle equals the change in the particle's kinetic energy.",
      difficulty: "Intermediate",
      duration: 35,
      has_simulation: true,
      has_quiz: true,
    },
  ]

  const { error: topicsError } = await supabase
    .from("topics")
    .upsert(mechanicsTopics, { onConflict: "chapter_id, slug" })

  if (topicsError) {
    console.error("Error seeding topics:", topicsError)
    throw new Error("Failed to seed topics")
  }

  // Get topic IDs
  const { data: topicData, error: topicFetchError } = await supabase
    .from("topics")
    .select("id, slug, chapter_id")
    .eq("chapter_id", mechanicsChapter.id)

  if (topicFetchError) {
    console.error("Error fetching topics:", topicFetchError)
    throw new Error("Failed to fetch topics")
  }

  const newtonsLawsTopic = topicData.find((topic) => topic.slug === "newtons-laws")

  if (!newtonsLawsTopic) {
    throw new Error("Newton's Laws topic not found")
  }

  // Seed quiz questions for Newton's Laws
  const newtonsLawsQuestions = [
    {
      topic_id: newtonsLawsTopic.id,
      question:
        "Which of Newton's laws states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force?",
      correct_answer: 0,
    },
    {
      topic_id: newtonsLawsTopic.id,
      question: "The equation F = ma represents which of Newton's laws?",
      correct_answer: 1,
    },
    {
      topic_id: newtonsLawsTopic.id,
      question: "For every action, there is an equal and opposite reaction. This statement represents:",
      correct_answer: 2,
    },
  ]

  const { data: questionsData, error: questionsError } = await supabase
    .from("quiz_questions")
    .upsert(newtonsLawsQuestions, { onConflict: "topic_id, question" })
    .select()

  if (questionsError) {
    console.error("Error seeding quiz questions:", questionsError)
    throw new Error("Failed to seed quiz questions")
  }

  // Seed options for the first question
  if (questionsData && questionsData.length > 0) {
    const firstQuestionOptions = [
      {
        question_id: questionsData[0].id,
        option_text: "Newton's First Law",
        option_index: 0,
      },
      {
        question_id: questionsData[0].id,
        option_text: "Newton's Second Law",
        option_index: 1,
      },
      {
        question_id: questionsData[0].id,
        option_text: "Newton's Third Law",
        option_index: 2,
      },
      {
        question_id: questionsData[0].id,
        option_text: "Newton's Law of Gravitation",
        option_index: 3,
      },
    ]

    const { error: optionsError } = await supabase
      .from("quiz_options")
      .upsert(firstQuestionOptions, { onConflict: "question_id, option_index" })

    if (optionsError) {
      console.error("Error seeding quiz options:", optionsError)
      throw new Error("Failed to seed quiz options")
    }

    // Seed options for the second question
    const secondQuestionOptions = [
      {
        question_id: questionsData[1].id,
        option_text: "Newton's First Law",
        option_index: 0,
      },
      {
        question_id: questionsData[1].id,
        option_text: "Newton's Second Law",
        option_index: 1,
      },
      {
        question_id: questionsData[1].id,
        option_text: "Newton's Third Law",
        option_index: 2,
      },
      {
        question_id: questionsData[1].id,
        option_text: "Newton's Law of Gravitation",
        option_index: 3,
      },
    ]

    const { error: options2Error } = await supabase
      .from("quiz_options")
      .upsert(secondQuestionOptions, { onConflict: "question_id, option_index" })

    if (options2Error) {
      console.error("Error seeding quiz options:", options2Error)
      throw new Error("Failed to seed quiz options")
    }

    // Seed options for the third question
    const thirdQuestionOptions = [
      {
        question_id: questionsData[2].id,
        option_text: "Newton's First Law",
        option_index: 0,
      },
      {
        question_id: questionsData[2].id,
        option_text: "Newton's Second Law",
        option_index: 1,
      },
      {
        question_id: questionsData[2].id,
        option_text: "Newton's Third Law",
        option_index: 2,
      },
      {
        question_id: questionsData[2].id,
        option_text: "The Law of Conservation of Energy",
        option_index: 3,
      },
    ]

    const { error: options3Error } = await supabase
      .from("quiz_options")
      .upsert(thirdQuestionOptions, { onConflict: "question_id, option_index" })

    if (options3Error) {
      console.error("Error seeding quiz options:", options3Error)
      throw new Error("Failed to seed quiz options")
    }
  }

  return {
    success: true,
    message: "Database seeded successfully",
  }
}
