// Prediction types
import type { PredictionCategory, PredictionStatus } from './basic'
import type { User } from './user'

export interface EvidenceLink {
  id: string
  url: string
  title: string
  description?: string
  submittedBy: string
  submittedAt: Date
  votes: {
    helpful: number
    notHelpful: number
  }
}

export interface VerificationResult {
  isTrue: boolean | null
  confidence: number
  voteCount: number
  evidence: EvidenceLink[]
  verifiedAt: Date
  verifiedBy: string[]
}

export interface Prediction {
  id: string
  title: string
  description?: string
  category: PredictionCategory
  expirationDate: Date
  createdAt: Date
  authorId: string
  author: User
  sourceLink?: string
  image?: string
  context?: string
  status: PredictionStatus
  verification?: VerificationResult
  views: number
  bookmarks: number
}
