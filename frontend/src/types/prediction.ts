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

export interface UserPrediction {
  userId: string
  confidence: number // 0-100
  rationale?: string
  sourceLink?: string
  submittedAt: Date
  lockedIn: boolean
}

export interface CrowdStats {
  totalPredictions: number
  averageConfidence: number
  distribution: {
    confident: number // 80-100%
    moderate: number // 40-79%
    skeptical: number // 0-39%
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

export interface PredictionLink {
  id: string
  type: 'similar' | 'derivative' | 'response' | 'update'
  targetPredictionId: string
  relationship: string // e.g., "Similar but with different timeline", "Response to this prediction"
  createdAt: Date
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
  // New confidence-based prediction data
  userPredictions: UserPrediction[]
  crowdStats: CrowdStats
  // Prediction linking system
  linkedPredictions: PredictionLink[]
  parentPredictionId?: string // If this is derived from another prediction
}
