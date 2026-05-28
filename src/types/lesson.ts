export type ShapeType = '2D' | '3D'
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type Subject = 'Geometry' | 'Algebra' | 'Trigonometry' | 'Physics'

export interface FormulaStep {
  stepNumber: number
  title: string
  explanation: string
  formulaText: string
  visualInstruction?: string
}

export interface Lesson {
  id: string
  title: string
  subject: Subject
  category: string
  shape: string
  shapeType: ShapeType
  difficulty: Difficulty
  description: string
  formula: string
  formulaLatex?: string
  color: string
  icon: string
  realLifeExamples: string[]
  derivationSteps: FormulaStep[]
  routePath: string
  available: boolean
  parentId?: string
}

export interface Progress {
  id: string
  userId: string
  lessonId: string
  completed: boolean
  completionPercentage: number
  lastVisitedAt: string
}
