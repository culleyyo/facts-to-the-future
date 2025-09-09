// Backend configuration and strategy

export const BACKEND_CONFIG = {
  // MVP Phase: Local Storage
  // Phase 2: Supabase
  // Phase 3: Custom backend if needed
  
  currentPhase: 'mvp' as 'mvp' | 'supabase' | 'custom',
  
  // Local Storage keys for MVP
  storage: {
    predictions: 'facts_predictions',
    users: 'facts_users',
    verifications: 'facts_verifications',
    artifacts: 'facts_artifacts'
  },
  
  // Supabase configuration (for Phase 2)
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || '',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
    tables: {
      predictions: 'predictions',
      users: 'users',
      verifications: 'verifications',
      artifacts: 'artifacts'
    }
  },
  
  // API endpoints (for Phase 3)
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    endpoints: {
      predictions: '/api/predictions',
      users: '/api/users',
      verifications: '/api/verifications',
      artifacts: '/api/artifacts'
    }
  }
}

// Verification thresholds
export const VERIFICATION_CONFIG = {
  minimumVotes: 10,
  consensusThreshold: 0.7, // 70% agreement required
  votingWindow: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  requiredEvidence: true,
  maxVotesPerUser: 10, // per day
  accountAgeRequired: 7 * 24 * 60 * 60 * 1000 // 7 days
}

// Category-specific verification sources
export const VERIFICATION_SOURCES = {
  political: {
    rss: ['reuters', 'ap-news', 'bbc-news'],
    apis: ['google-news', 'newsapi'],
    keywords: ['indicted', 'arrested', 'elected', 'resigned', 'impeached']
  },
  entertainment: {
    apis: ['spotify', 'youtube', 'twitter'],
    sources: ['billboard', 'variety', 'hollywood-reporter']
  },
  weather: {
    apis: ['noaa', 'openweather'],
    sources: ['weather.com', 'accuweather']
  },
  market: {
    apis: ['yahoo-finance', 'alpha-vantage'],
    sources: ['bloomberg', 'reuters-finance']
  },
  cultural: {
    apis: ['twitter', 'reddit', 'youtube'],
    metrics: ['views', 'likes', 'shares', 'trending']
  }
}
