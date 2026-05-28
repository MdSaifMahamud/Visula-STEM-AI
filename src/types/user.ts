export type UserRole = 'student' | 'teacher'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  avatar?: string
}

export interface AITutorMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AITutorConversation {
  id: string
  lessonId: string
  messages: AITutorMessage[]
  createdAt: string
}
