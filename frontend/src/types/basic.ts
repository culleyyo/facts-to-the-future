// Basic types that don't depend on anything else
export type PredictionCategory = 
  | 'political' 
  | 'entertainment' 
  | 'weather' 
  | 'cultural' 
  | 'market'
  | 'sports'
  | 'technology'
  | 'science'

export type PredictionStatus = 
  | 'active'
  | 'expired'
  | 'verified'
  | 'disputed'

export type VoteType = 
  | 'true'
  | 'false'
  | 'unclear'
  | 'invalid'

// XP and leveling constants
export const XP_CONFIG = {
  MAKE_PREDICTION: 10,
  CORRECT_PREDICTION: 50,
  CONTRARIAN_WIN: 100, // right when crowd was wrong
  STREAK_BONUS: 25,
  ADD_SOURCE: 5,
  LEVELS: [0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000]
} as const

export const BADGE_TYPES = {
  STREAK_3: { name: '3 Day Streak', icon: '🔥', threshold: 3 },
  STREAK_7: { name: 'Week Warrior', icon: '⚡', threshold: 7 },
  STREAK_30: { name: 'Monthly Master', icon: '👑', threshold: 30 },
  CONTRARIAN_5: { name: 'Contrarian', icon: '🎯', threshold: 5 },
  ACCURACY_80: { name: 'Sharp Shooter', icon: '🏹', threshold: 80 },
  FIRST_PREDICTION: { name: 'First Steps', icon: '👶', threshold: 1 },
  HUNDRED_CLUB: { name: 'Century Club', icon: '💯', threshold: 100 }
} as const
