// User types - no dependencies

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: Date
  type: 'streak' | 'accuracy' | 'contrarian' | 'category' | 'social'
}

export interface User {
  id: string
  username: string
  displayName: string
  avatar?: string
  createdAt: Date
  stats: {
    totalPredictions: number
    correctPredictions: number
    accuracy: number
    reputation: number
    // New gamification stats
    xp: number
    level: number
    currentStreak: number
    longestStreak: number
    contrarian: number // times user was right when crowd was wrong
    crowdFollower: number // times user was right with the crowd
  }
  badges: Badge[]
  lastPredictionDate?: Date
}
