// Sample data for testing and development
import type { Prediction, User, PredictionCategory } from '../types'

export const sampleUsers: User[] = [
  {
    id: 'user1',
    username: 'futurist_ian',
    displayName: 'Ian the Futurist',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ian',
    createdAt: new Date('2024-01-15'),
    stats: {
      totalPredictions: 12,
      correctPredictions: 8,
      accuracy: 66.7,
      reputation: 850
    }
  },
  {
    id: 'user2',
    username: 'meme_prophet',
    displayName: 'Meme Prophet',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meme',
    createdAt: new Date('2024-02-01'),
    stats: {
      totalPredictions: 8,
      correctPredictions: 6,
      accuracy: 75.0,
      reputation: 720
    }
  },
  {
    id: 'user3',
    username: 'news_hound',
    displayName: 'News Hound',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=news',
    createdAt: new Date('2024-01-20'),
    stats: {
      totalPredictions: 15,
      correctPredictions: 11,
      accuracy: 73.3,
      reputation: 920
    }
  }
]

export const samplePredictions: Prediction[] = [
  {
    id: 'pred1',
    title: 'Trump will be indicted again by Oct 1',
    description: 'Based on current legal proceedings and timeline analysis',
    category: 'political' as PredictionCategory,
    expirationDate: new Date('2024-10-01'),
    createdAt: new Date('2024-09-15'),
    authorId: 'user3',
    author: sampleUsers[2],
    sourceLink: 'https://example.com/legal-analysis',
    context: 'Multiple ongoing investigations suggest additional charges are likely',
    status: 'active',
    views: 1247,
    bookmarks: 89
  },
  {
    id: 'pred2',
    title: 'Drake will drop a new album in 2025',
    description: 'Industry sources and social media hints point to new release',
    category: 'entertainment' as PredictionCategory,
    expirationDate: new Date('2025-12-31'),
    createdAt: new Date('2024-09-10'),
    authorId: 'user1',
    author: sampleUsers[0],
    sourceLink: 'https://example.com/drake-rumors',
    context: 'Drake has been hinting at new music on social media',
    status: 'active',
    views: 892,
    bookmarks: 156
  },
  {
    id: 'pred3',
    title: 'A hurricane will hit NYC this summer',
    description: 'Weather patterns and historical data suggest increased risk',
    category: 'weather' as PredictionCategory,
    expirationDate: new Date('2024-08-31'),
    createdAt: new Date('2024-06-01'),
    authorId: 'user2',
    author: sampleUsers[1],
    sourceLink: 'https://example.com/weather-analysis',
    context: 'NOAA data shows above-average hurricane activity predicted',
    status: 'expired',
    views: 2341,
    bookmarks: 67,
    verification: {
      isTrue: false,
      confidence: 85,
      voteCount: 23,
      evidence: [
        {
          id: 'ev1',
          url: 'https://weather.com/nyc-summer-2024',
          title: 'NYC Summer Weather Report',
          description: 'No major hurricanes hit NYC in summer 2024',
          submittedBy: 'user3',
          submittedAt: new Date('2024-09-01'),
          votes: { helpful: 18, notHelpful: 2 }
        }
      ],
      verifiedAt: new Date('2024-09-05'),
      verifiedBy: ['user1', 'user2', 'user3']
    }
  },
  {
    id: 'pred4',
    title: 'This meme will go viral next week',
    description: 'A specific meme format that I predict will explode',
    category: 'cultural' as PredictionCategory,
    expirationDate: new Date('2024-09-20'),
    createdAt: new Date('2024-09-13'),
    authorId: 'user2',
    author: sampleUsers[1],
    image: 'https://example.com/meme-preview.jpg',
    context: 'The meme format has been gaining traction in niche communities',
    status: 'verified',
    views: 3456,
    bookmarks: 234,
    verification: {
      isTrue: true,
      confidence: 92,
      voteCount: 31,
      evidence: [
        {
          id: 'ev2',
          url: 'https://twitter.com/trending/meme',
          title: 'Meme Goes Viral on Twitter',
          description: 'Meme reached 1M+ retweets in 3 days',
          submittedBy: 'user1',
          submittedAt: new Date('2024-09-18'),
          votes: { helpful: 28, notHelpful: 1 }
        }
      ],
      verifiedAt: new Date('2024-09-22'),
      verifiedBy: ['user1', 'user3']
    }
  },
  {
    id: 'pred5',
    title: 'Tesla stock will hit $300 by end of year',
    description: 'Based on production targets and market analysis',
    category: 'market' as PredictionCategory,
    expirationDate: new Date('2024-12-31'),
    createdAt: new Date('2024-09-05'),
    authorId: 'user1',
    author: sampleUsers[0],
    sourceLink: 'https://example.com/tesla-analysis',
    context: 'Q3 delivery numbers and new model launches support bullish outlook',
    status: 'active',
    views: 1876,
    bookmarks: 123
  }
]

// Initialize sample data in localStorage
export const initializeSampleData = () => {
  // Only initialize if no data exists
  if (!localStorage.getItem('facts_predictions')) {
    localStorage.setItem('facts_predictions', JSON.stringify(samplePredictions))
  }
  
  if (!localStorage.getItem('facts_users')) {
    localStorage.setItem('facts_users', JSON.stringify(sampleUsers))
  }
  
  if (!localStorage.getItem('facts_verifications')) {
    localStorage.setItem('facts_verifications', JSON.stringify([]))
  }
  
  if (!localStorage.getItem('facts_artifacts')) {
    localStorage.setItem('facts_artifacts', JSON.stringify([]))
  }
}
