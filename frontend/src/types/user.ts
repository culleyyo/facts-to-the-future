// User types - no dependencies
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
  }
}
