import { create } from 'zustand'
import type { User, Prediction } from '../types'
import { dataService } from '../services/storage'

interface AppState {
  // User state
  currentUser: User | null
  isAuthenticated: boolean
  
  // Predictions state
  predictions: Prediction[]
  currentPrediction: Prediction | null
  
  // App state
  isLoading: boolean
  error: string | null
  
  // Actions
  setCurrentUser: (user: User) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Prediction actions
  loadPredictions: () => Promise<void>
  loadPrediction: (id: string) => Promise<void>
  createPrediction: (form: any) => Promise<Prediction | null>
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentUser: null,
  isAuthenticated: false,
  predictions: [],
  currentPrediction: null,
  isLoading: false,
  error: null,
  
  // Actions
  setCurrentUser: (user) => set(() => ({
    currentUser: user,
    isAuthenticated: true
  })),
  
  clearUser: () => set(() => ({
    currentUser: null,
    isAuthenticated: false
  })),
  
  setLoading: (loading) => set(() => ({ isLoading: loading })),
  
  setError: (error) => set(() => ({ error })),
  
  // Prediction actions - temporarily disabled again
  loadPredictions: async () => {
    console.log('loadPredictions - temporarily disabled')
  },
  
  loadPrediction: async (id: string) => {
    console.log('loadPrediction - temporarily disabled', id)
  },
  
  createPrediction: async (form: any) => {
    console.log('createPrediction - temporarily disabled', form)
    return null
  }
}))
