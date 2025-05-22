"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Get all subjects
export async function getSubjects() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("subjects").select("*").order("title")

  if (error) {
    console.error("Error fetching subjects:", error)
    throw new Error("Failed to fetch subjects")
  }

  return data
}

// Get subject by slug
export async function getSubjectBySlug(slug: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("subjects").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching subject with slug ${slug}:`, error)
    return null
  }

  return data
}

// Get chapters for a subject
export async function getChaptersBySubjectId(subjectId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("chapters").select("*").eq("subject_id", subjectId).order("title")

  if (error) {
    console.error(`Error fetching chapters for subject ${subjectId}:`, error)
    throw new Error("Failed to fetch chapters")
  }

  return data
}

// Get chapter by slug
export async function getChapterBySlug(subjectId: string, slug: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("subject_id", subjectId)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error(`Error fetching chapter with slug ${slug}:`, error)
    return null
  }

  return data
}

// Get topics for a chapter
export async function getTopicsByChapterId(chapterId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("topics").select("*").eq("chapter_id", chapterId).order("title")

  if (error) {
    console.error(`Error fetching topics for chapter ${chapterId}:`, error)
    throw new Error("Failed to fetch topics")
  }

  return data
}

// Get topic by slug
export async function getTopicBySlug(chapterId: string, slug: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("chapter_id", chapterId)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error(`Error fetching topic with slug ${slug}:`, error)
    return null
  }

  return data
}

// Get quiz questions for a topic
export async function getQuizQuestionsByTopicId(topicId: string) {
  const supabase = createServerSupabaseClient()

  const { data: questions, error } = await supabase.from("quiz_questions").select("*").eq("topic_id", topicId)

  if (error) {
    console.error(`Error fetching quiz questions for topic ${topicId}:`, error)
    throw new Error("Failed to fetch quiz questions")
  }

  // Get options for each question
  const questionsWithOptions = await Promise.all(
    questions.map(async (question) => {
      const { data: options, error: optionsError } = await supabase
        .from("quiz_options")
        .select("*")
        .eq("question_id", question.id)
        .order("option_index")

      if (optionsError) {
        console.error(`Error fetching options for question ${question.id}:`, optionsError)
        return {
          ...question,
          options: [],
        }
      }

      return {
        ...question,
        options,
      }
    }),
  )

  return questionsWithOptions
}

// Track user progress
export async function trackUserProgress(userId: string, topicId: string, completed: boolean, quizScore?: number) {
  const supabase = createServerSupabaseClient()

  // Check if progress record exists
  const { data: existingProgress, error: checkError } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking existing progress:", checkError)
    throw new Error("Failed to track progress")
  }

  if (!existingProgress) {
    // Create new progress record
    const { error } = await supabase.from("user_progress").insert({
      user_id: userId,
      topic_id: topicId,
      completed,
      quiz_score: quizScore,
      last_accessed: new Date().toISOString(),
    })

    if (error) {
      console.error("Error creating progress record:", error)
      throw new Error("Failed to track progress")
    }
  } else {
    // Update existing progress record
    const { error } = await supabase
      .from("user_progress")
      .update({
        completed: completed || existingProgress.completed,
        quiz_score: quizScore !== undefined ? quizScore : existingProgress.quiz_score,
        last_accessed: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingProgress.id)

    if (error) {
      console.error("Error updating progress record:", error)
      throw new Error("Failed to track progress")
    }
  }

  // Get the topic to find the chapter and subject for path revalidation
  const { data: topic, error: topicError } = await supabase
    .from("topics")
    .select("chapter_id")
    .eq("id", topicId)
    .single()

  if (topicError) {
    console.error("Error fetching topic:", topicError)
  } else {
    const { data: chapter, error: chapterError } = await supabase
      .from("chapters")
      .select("subject_id, slug")
      .eq("id", topic.chapter_id)
      .single()

    if (chapterError) {
      console.error("Error fetching chapter:", chapterError)
    } else {
      const { data: subject, error: subjectError } = await supabase
        .from("subjects")
        .select("slug")
        .eq("id", chapter.subject_id)
        .single()

      if (subjectError) {
        console.error("Error fetching subject:", subjectError)
      } else {
        revalidatePath(`/visualearn/${subject.slug}/${chapter.slug}`)
      }
    }
  }
}

// Get user progress for a topic
export async function getUserProgressForTopic(userId: string, topicId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error(`Error fetching progress for topic ${topicId}:`, error)
    throw new Error("Failed to fetch progress")
  }

  return data || null
}

// Get user progress for a chapter
export async function getUserProgressForChapter(userId: string, chapterId: string) {
  const supabase = createServerSupabaseClient()

  // Get all topics for this chapter
  const { data: topics, error: topicsError } = await supabase.from("topics").select("id").eq("chapter_id", chapterId)

  if (topicsError) {
    console.error(`Error fetching topics for chapter ${chapterId}:`, topicsError)
    throw new Error("Failed to fetch topics")
  }

  if (topics.length === 0) {
    return {
      totalTopics: 0,
      completedTopics: 0,
      progress: 0,
    }
  }

  const topicIds = topics.map((topic) => topic.id)

  // Get progress for these topics
  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .in("topic_id", topicIds)
    .eq("completed", true)

  if (progressError) {
    console.error("Error fetching progress:", progressError)
    throw new Error("Failed to fetch progress")
  }

  return {
    totalTopics: topics.length,
    completedTopics: progress.length,
    progress: topics.length > 0 ? Math.round((progress.length / topics.length) * 100) : 0,
  }
}

// Get user progress summary
export async function getUserProgressSummary(userId: string) {
  const supabase = createServerSupabaseClient()

  // Get all completed topics
  const { data: completedTopics, error: completedError } = await supabase
    .from("user_progress")
    .select("topic_id")
    .eq("user_id", userId)
    .eq("completed", true)

  if (completedError) {
    console.error("Error fetching completed topics:", completedError)
    throw new Error("Failed to fetch progress summary")
  }

  // Get total topics count
  const { count: totalTopics, error: countError } = await supabase
    .from("topics")
    .select("*", { count: "exact", head: true })

  if (countError) {
    console.error("Error counting topics:", countError)
    throw new Error("Failed to fetch progress summary")
  }

  // Get chapters with at least one completed topic
  const { data: chapters, error: chaptersError } = await supabase
    .from("topics")
    .select("chapter_id")
    .in(
      "id",
      completedTopics.map((t) => t.topic_id),
    )
    .distinct()

  if (chaptersError) {
    console.error("Error fetching chapters:", chaptersError)
    throw new Error("Failed to fetch progress summary")
  }

  // Get total chapters count
  const { count: totalChapters, error: chapterCountError } = await supabase
    .from("chapters")
    .select("*", { count: "exact", head: true })

  if (chapterCountError) {
    console.error("Error counting chapters:", chapterCountError)
    throw new Error("Failed to fetch progress summary")
  }

  // Get quiz scores
  const { data: quizzes, error: quizzesError } = await supabase
    .from("user_progress")
    .select("quiz_score")
    .eq("user_id", userId)
    .not("quiz_score", "is", null)

  if (quizzesError) {
    console.error("Error fetching quizzes:", quizzesError)
    throw new Error("Failed to fetch progress summary")
  }

  const completedQuizzes = quizzes.length
  const averageScore =
    quizzes.length > 0 ? Math.round(quizzes.reduce((sum, q) => sum + (q.quiz_score || 0), 0) / quizzes.length) : 0

  return {
    topicsCompleted: completedTopics.length,
    totalTopics: totalTopics || 0,
    chaptersCompleted: chapters.length,
    totalChapters: totalChapters || 0,
    quizzesCompleted: completedQuizzes,
    averageQuizScore: averageScore,
  }
}
