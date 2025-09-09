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
