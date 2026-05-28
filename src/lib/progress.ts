'use client'

import type { QuizAttempt } from '@/types/quiz'

const QUIZ_ATTEMPTS_KEY = 'visual-stem-quiz-attempts'
const LESSON_PROGRESS_KEY = 'visual-stem-lesson-progress'

export interface LessonProgress {
  lessonId: string
  completed: boolean
  completionPercentage: number
  lastVisitedAt: string
}

export function saveQuizAttempt(attempt: QuizAttempt): void {
  if (typeof window === 'undefined') return
  const existing = getQuizAttempts()
  existing.push(attempt)
  localStorage.setItem(QUIZ_ATTEMPTS_KEY, JSON.stringify(existing))
}

export function getQuizAttempts(): QuizAttempt[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(QUIZ_ATTEMPTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getQuizAttemptsByLesson(lessonId: string): QuizAttempt[] {
  return getQuizAttempts().filter((a) => a.lessonId === lessonId)
}

export function saveLessonProgress(progress: LessonProgress): void {
  if (typeof window === 'undefined') return
  const existing = getLessonProgressAll()
  const idx = existing.findIndex((p) => p.lessonId === progress.lessonId)
  if (idx >= 0) {
    existing[idx] = progress
  } else {
    existing.push(progress)
  }
  localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(existing))
}

export function getLessonProgressAll(): LessonProgress[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LESSON_PROGRESS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getLessonProgress(lessonId: string): LessonProgress | undefined {
  return getLessonProgressAll().find((p) => p.lessonId === lessonId)
}

export interface ProgressStats {
  totalLessonsVisited: number
  totalLessonsCompleted: number
  totalQuizzesAttempted: number
  averageScore: number
  strongTopics: string[]
  weakTopics: string[]
  recentActivity: QuizAttempt[]
}

export function getProgressStats(): ProgressStats {
  const attempts = getQuizAttempts()
  const lessonProgress = getLessonProgressAll()

  const totalLessonsVisited = lessonProgress.length
  const totalLessonsCompleted = lessonProgress.filter((p) => p.completed).length
  const totalQuizzesAttempted = attempts.length

  const totalScore = attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0)
  const averageScore = attempts.length > 0 ? Math.round(totalScore / attempts.length) : 0

  // Aggregate scores by topic
  const topicScores: Record<string, { total: number; count: number }> = {}
  attempts.forEach((attempt) => {
    attempt.answers.forEach((ans) => {
      if (!topicScores[ans.questionId]) {
        topicScores[ans.questionId] = { total: 0, count: 0 }
      }
      topicScores[ans.questionId].total += ans.isCorrect ? 1 : 0
      topicScores[ans.questionId].count += 1
    })
  })

  // Derive lesson-level scores
  const lessonScores: Record<string, number> = {}
  attempts.forEach((attempt) => {
    const pct = (attempt.score / attempt.totalQuestions) * 100
    if (!lessonScores[attempt.lessonId] || pct > lessonScores[attempt.lessonId]) {
      lessonScores[attempt.lessonId] = pct
    }
  })

  const strongTopics = Object.entries(lessonScores)
    .filter(([, score]) => score >= 70)
    .map(([id]) => id)

  const weakTopics = Object.entries(lessonScores)
    .filter(([, score]) => score < 70)
    .map(([id]) => id)

  const recentActivity = [...attempts]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5)

  return {
    totalLessonsVisited,
    totalLessonsCompleted,
    totalQuizzesAttempted,
    averageScore,
    strongTopics,
    weakTopics,
    recentActivity,
  }
}
