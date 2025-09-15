import React, { useState, useEffect } from 'react'
import { PredictionCard, PredictionModal } from '../components'
import type { Prediction, PredictionCategory, CreatePredictionForm } from '../types'
import { samplePredictions, sampleUsers } from '../data/sampleData'
import './HomePage.css'

type MainTab = 'predictions' | 'facts' | 'leaderboard'

const HomePage: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [selectedCategory, setSelectedCategory] = useState<PredictionCategory | 'all' | 'bookmarks'>('all')
  const [activeTab, setActiveTab] = useState<MainTab>('predictions')
  const [currentUser] = useState(sampleUsers[0]) // Mock current user
  const [bookmarkedPredictions, setBookmarkedPredictions] = useState<Set<string>>(new Set(['pred1', 'pred4'])) // Mock bookmarks
  const [showPredictionModal, setShowPredictionModal] = useState(false)
  const [similarPrediction, setSimilarPrediction] = useState<Prediction | null>(null)

  useEffect(() => {
    // In real app, this would fetch from API/storage
    setPredictions(samplePredictions)
  }, [])

  const getFilteredContent = () => {
    if (activeTab === 'facts') {
      // Show only verified/resolved predictions
      return predictions.filter(prediction => 
        prediction.status === 'verified' || prediction.status === 'expired'
      )
    } else if (activeTab === 'leaderboard') {
      // Return empty for now - we'll render leaderboard separately
      return []
    } else {
      // Predictions tab - show active predictions with category filtering
      return predictions.filter(prediction => {
        // First filter by active status
        if (prediction.status !== 'active') return false
        
        // Then apply category filtering
        if (selectedCategory === 'all') return true
        if (selectedCategory === 'bookmarks') return bookmarkedPredictions.has(prediction.id)
        return prediction.category === selectedCategory
      })
    }
  }

  const filteredContent = getFilteredContent()

  const categories: Array<{ key: PredictionCategory | 'all' | 'bookmarks'; label: string; emoji: string }> = [
    { key: 'all', label: 'All', emoji: '🔮' },
    { key: 'bookmarks', label: 'Bookmarks', emoji: '🔖' },
    { key: 'political', label: 'Politics', emoji: '🏛️' },
    { key: 'entertainment', label: 'Entertainment', emoji: '🎭' },
    { key: 'cultural', label: 'Culture', emoji: '🌟' },
    { key: 'market', label: 'Markets', emoji: '📈' },
    { key: 'sports', label: 'Sports', emoji: '⚽' },
    { key: 'technology', label: 'Tech', emoji: '💻' },
    { key: 'weather', label: 'Weather', emoji: '🌤️' },
    { key: 'science', label: 'Science', emoji: '🧬' }
  ]

  const handleRatePrediction = (predictionId: string, confidence: number, rationale?: string, sourceLink?: string) => {
    console.log('Rating prediction:', { predictionId, confidence, rationale, sourceLink })
    // In real app, this would submit to API/storage
  }

  const handleCreateSimilar = (originalPrediction: Prediction) => {
    setSimilarPrediction(originalPrediction)
    setShowPredictionModal(true)
  }

  const handleCreatePrediction = () => {
    setSimilarPrediction(null)
    setShowPredictionModal(true)
  }

  const handlePredictionModalClose = () => {
    setShowPredictionModal(false)
    setSimilarPrediction(null)
  }

  const handlePredictionSubmit = async (form: CreatePredictionForm) => {
    console.log('Creating prediction:', form)
    // In real app, this would submit to API/storage
    // For now, just close the modal
    setShowPredictionModal(false)
    setSimilarPrediction(null)
  }

  const handleBookmark = (predictionId: string) => {
    setBookmarkedPredictions(prev => {
      const newBookmarks = new Set(prev)
      if (newBookmarks.has(predictionId)) {
        newBookmarks.delete(predictionId)
        console.log('Removed bookmark for:', predictionId)
      } else {
        newBookmarks.add(predictionId)
        console.log('Added bookmark for:', predictionId)
      }
      return newBookmarks
    })
  }

  const renderLeaderboard = () => {
    const sortedUsers = [...sampleUsers].sort((a, b) => b.stats.accuracy - a.stats.accuracy)
    
    return (
      <div className="leaderboard">
        <h2 className="leaderboard-title">🏆 Top Predictors</h2>
        <div className="leaderboard-list">
          {sortedUsers.map((user, index) => (
            <div key={user.id} className="leaderboard-item">
              <div className="rank">#{index + 1}</div>
              <div className="user-info">
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.displayName}
                  className="user-avatar"
                />
                <div className="user-details">
                  <span className="user-name">{user.displayName}</span>
                  <span className="user-username">@{user.username}</span>
                </div>
              </div>
              <div className="user-stats">
                <div className="stat">
                  <span className="stat-value">{Math.round(user.stats.accuracy)}%</span>
                  <span className="stat-label">Accuracy</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{user.stats.level}</span>
                  <span className="stat-label">Level</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{user.stats.currentStreak}</span>
                  <span className="stat-label">Streak</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="home-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="title-emoji">🔮</span>
          Facts to the Future
        </h1>
        <p className="page-subtitle">Test your instincts about what's coming next</p>
        
        <button className="main-cta-button" onClick={handleCreatePrediction}>
          <span className="cta-icon">✨</span>
          Make a Prediction
        </button>
        
        {/* Main Navigation Tabs */}
        <div className="main-tabs">
          <button
            className={`main-tab ${activeTab === 'predictions' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictions')}
          >
            <span className="tab-emoji">🔮</span>
            <div className="tab-content">
              <span className="tab-label">Predictions</span>
              <span className="tab-description">Active predictions</span>
            </div>
          </button>
          <button
            className={`main-tab ${activeTab === 'facts' ? 'active' : ''}`}
            onClick={() => setActiveTab('facts')}
          >
            <span className="tab-emoji">✅</span>
            <div className="tab-content">
              <span className="tab-label">Facts</span>
              <span className="tab-description">Verified outcomes</span>
            </div>
          </button>
          <button
            className={`main-tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <span className="tab-emoji">🏆</span>
            <div className="tab-content">
              <span className="tab-label">Leaderboard</span>
              <span className="tab-description">Top predictors</span>
            </div>
          </button>
        </div>
      </div>

      {/* Category Filters - only show for predictions and facts tabs */}
      {(activeTab === 'predictions' || activeTab === 'facts') && (
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.key}
              className={`category-button ${selectedCategory === category.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.key)}
            >
              <span className="category-emoji">{category.emoji}</span>
              <span className="category-label">{category.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      <div className="content-area">
        {activeTab === 'leaderboard' ? (
          renderLeaderboard()
        ) : (
          <div className="predictions-grid">
            {filteredContent.length > 0 ? (
              filteredContent.map(prediction => (
                <PredictionCard
                  key={prediction.id}
                  prediction={prediction}
                  currentUserId={currentUser?.id}
                  onRate={handleRatePrediction}
                  onCreateSimilar={handleCreateSimilar}
                  onBookmark={handleBookmark}
                  isBookmarked={bookmarkedPredictions.has(prediction.id)}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  {activeTab === 'facts' ? '📚' : '🔍'}
                </div>
                <h3>
                  {activeTab === 'facts' 
                    ? 'No verified facts yet' 
                    : 'No predictions found'
                  }
                </h3>
                <p>
                  {activeTab === 'facts'
                    ? 'Facts will appear here as predictions get verified!'
                    : 'Try selecting a different category or check back later for new predictions!'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prediction Modal */}
      <PredictionModal
        isOpen={showPredictionModal}
        onClose={handlePredictionModalClose}
        onSubmit={handlePredictionSubmit}
        prefillPrediction={similarPrediction ? {
          title: `${similarPrediction.title} (Similar)`,
          category: similarPrediction.category,
          description: similarPrediction.description,
          context: similarPrediction.context
        } : undefined}
      />

    </div>
  )
}

export default HomePage
