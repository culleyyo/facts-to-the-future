// Main types export - re-exports from smaller modules
export * from './basic'
export * from './user'
export * from './prediction'

// Additional types that depend on the above
import type { VoteType } from './basic'

export interface VerificationVote {
  id: string
  predictionId: string
  userId: string
  vote: VoteType
  evidence?: string
  submittedAt: Date
  confidence: number
}

export interface Artifact {
  id: string
  predictionId: string
  userId: string
  type: 'card' | 'stamp' | 'badge' | 'trophy'
  title: string
  description: string
  imageUrl: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt: Date
}

// API types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

// Form types
import type { PredictionCategory } from './basic'

export interface CreatePredictionForm {
  title: string
  description?: string
  category: PredictionCategory
  expirationDate: Date
  sourceLink?: string
  image?: File
  context?: string
}

export interface VerificationForm {
  vote: VoteType
  evidence?: string
  confidence: number
}