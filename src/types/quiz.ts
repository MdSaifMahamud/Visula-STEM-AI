export type QuestionType = 'MCQ' | 'fill-blank' | 'numerical' | 'formula-select' | 'visual'

export interface QuizOption {
  id: string
  text: string
}

export interface Question {
  id: string
  quizId: string
  questionText: string
  questionType: QuestionType
  options?: QuizOption[]
  correctAnswer: string
  explanation: string
  topicTag: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface Quiz {
  id: string
  lessonId: string
  title: string
  difficulty: string
  questions: Question[]
}

export interface StudentAnswer {
  questionId: string
  answer: string
  isCorrect: boolean
  timeTaken?: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  lessonId: string
  shapeName: string
  score: number
  totalQuestions: number
  answers: StudentAnswer[]
  completedAt: string
  timeTaken: number
}
