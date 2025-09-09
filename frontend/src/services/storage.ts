// Data layer for Facts to the Future
// Supports local storage for MVP, easily upgradeable to Supabase

import { BACKEND_CONFIG } from '../config/backend'
import { 
  Prediction, 
  User, 
  VerificationVote, 
  Artifact,
  CreatePredictionForm,
  VerificationForm,
  ApiResponse,
  PaginatedResponse 
} from '../types'

// Generic storage interface
interface StorageAdapter {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
}

// Local Storage adapter
class LocalStorageAdapter implements StorageAdapter {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }

  clear(): void {
    localStorage.clear()
  }
}

// Data service class
class DataService {
  private storage: StorageAdapter

  constructor() {
    this.storage = new LocalStorageAdapter()
  }

  // Predictions
  async getPredictions(page = 1, limit = 20): Promise<PaginatedResponse<Prediction>> {
    const predictions = this.storage.get<Prediction[]>(BACKEND_CONFIG.storage.predictions) || []
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = predictions.slice(startIndex, endIndex)
    
    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: predictions.length,
        hasMore: endIndex < predictions.length
      }
    }
  }

  async getPrediction(id: string): Promise<Prediction | null> {
    const predictions = this.storage.get<Prediction[]>(BACKEND_CONFIG.storage.predictions) || []
    return predictions.find(p => p.id === id) || null
  }

  async createPrediction(form: CreatePredictionForm, author: User): Promise<Prediction> {
    const predictions = this.storage.get<Prediction[]>(BACKEND_CONFIG.storage.predictions) || []
    
    const newPrediction: Prediction = {
      id: this.generateId(),
      title: form.title,
      description: form.description,
      category: form.category,
      expirationDate: form.expirationDate,
      createdAt: new Date(),
      authorId: author.id,
      author,
      sourceLink: form.sourceLink,
      context: form.context,
      status: 'active',
      views: 0,
      bookmarks: 0
    }

    predictions.unshift(newPrediction) // Add to beginning
    this.storage.set(BACKEND_CONFIG.storage.predictions, predictions)
    
    return newPrediction
  }

  // Users
  async getCurrentUser(): Promise<User | null> {
    return this.storage.get<User>('current_user')
  }

  async setCurrentUser(user: User): Promise<void> {
    this.storage.set('current_user', user)
  }

  async createUser(username: string, displayName: string): Promise<User> {
    const users = this.storage.get<User[]>(BACKEND_CONFIG.storage.users) || []
    
    const newUser: User = {
      id: this.generateId(),
      username,
      displayName,
      createdAt: new Date(),
      stats: {
        totalPredictions: 0,
        correctPredictions: 0,
        accuracy: 0,
        reputation: 100
      }
    }

    users.push(newUser)
    this.storage.set(BACKEND_CONFIG.storage.users, users)
    this.storage.set('current_user', newUser)
    
    return newUser
  }

  // Verifications
  async submitVerification(predictionId: string, form: VerificationForm, userId: string): Promise<void> {
    const verifications = this.storage.get<VerificationVote[]>(BACKEND_CONFIG.storage.verifications) || []
    
    const newVerification: VerificationVote = {
      id: this.generateId(),
      predictionId,
      userId,
      vote: form.vote,
      evidence: form.evidence,
      submittedAt: new Date(),
      confidence: form.confidence
    }

    verifications.push(newVerification)
    this.storage.set(BACKEND_CONFIG.storage.verifications, verifications)
  }

  async getVerifications(predictionId: string): Promise<VerificationVote[]> {
    const verifications = this.storage.get<VerificationVote[]>(BACKEND_CONFIG.storage.verifications) || []
    return verifications.filter(v => v.predictionId === predictionId)
  }

  // Artifacts
  async getUserArtifacts(userId: string): Promise<Artifact[]> {
    const artifacts = this.storage.get<Artifact[]>(BACKEND_CONFIG.storage.artifacts) || []
    return artifacts.filter(a => a.userId === userId)
  }

  async createArtifact(predictionId: string, userId: string, type: Artifact['type']): Promise<Artifact> {
    const artifacts = this.storage.get<Artifact[]>(BACKEND_CONFIG.storage.artifacts) || []
    
    const newArtifact: Artifact = {
      id: this.generateId(),
      predictionId,
      userId,
      type,
      title: this.getArtifactTitle(type),
      description: this.getArtifactDescription(type),
      imageUrl: this.getArtifactImage(type),
      rarity: this.getArtifactRarity(type),
      earnedAt: new Date()
    }

    artifacts.push(newArtifact)
    this.storage.set(BACKEND_CONFIG.storage.artifacts, artifacts)
    
    return newArtifact
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private getArtifactTitle(type: Artifact['type']): string {
    const titles = {
      card: 'Prediction Card',
      stamp: 'Verified Stamp',
      badge: 'Accuracy Badge',
      trophy: 'Prediction Trophy'
    }
    return titles[type]
  }

  private getArtifactDescription(type: Artifact['type']): string {
    const descriptions = {
      card: 'A commemorative card for your accurate prediction',
      stamp: 'Official verification stamp',
      badge: 'Badge showing your prediction accuracy',
      trophy: 'Trophy for outstanding prediction skills'
    }
    return descriptions[type]
  }

  private getArtifactImage(type: Artifact['type']): string {
    // Placeholder images - replace with actual URLs later
    return `/images/artifacts/${type}.png`
  }

  private getArtifactRarity(type: Artifact['type']): Artifact['rarity'] {
    // Simple rarity logic - can be enhanced later
    const rarities: Artifact['rarity'][] = ['common', 'rare', 'epic', 'legendary']
    return rarities[Math.floor(Math.random() * rarities.length)]
  }
}

// Export singleton instance
export const dataService = new DataService()
