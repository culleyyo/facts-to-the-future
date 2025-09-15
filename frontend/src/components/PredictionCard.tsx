import React, { useState, useEffect } from 'react'
import { RatingModal } from './'
import type { Prediction, UserPrediction } from '../types'
import './PredictionCard.css'

interface PredictionCardProps {
  prediction: Prediction
  currentUserId?: string
  onRate?: (predictionId: string, confidence: number, rationale?: string, sourceLink?: string) => void
  onCreateSimilar?: (originalPrediction: Prediction) => void
  onBookmark?: (predictionId: string) => void
  isBookmarked?: boolean
  compact?: boolean
}

const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  currentUserId,
  onRate,
  onCreateSimilar,
  onBookmark,
  isBookmarked = false,
  compact = false
}) => {
  const [timeLeft, setTimeLeft] = useState('')
  const [userPrediction, setUserPrediction] = useState<UserPrediction | null>(null)
  const [showCrowd, setShowCrowd] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)

  // Find current user's prediction
  useEffect(() => {
    if (currentUserId) {
      const userPred = prediction.userPredictions.find(p => p.userId === currentUserId)
      setUserPrediction(userPred || null)
      setShowCrowd(!!userPred?.lockedIn)
    }
  }, [currentUserId, prediction.userPredictions])

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const expiry = new Date(prediction.expirationDate).getTime()
      const distance = expiry - now

      if (distance < 0) {
        setTimeLeft('Expired')
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft(`${minutes}m`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [prediction.expirationDate])

  const getCategoryColor = (category: string) => {
    const colors = {
      political: '#dc2626',
      entertainment: '#7c3aed',
      weather: '#2563eb',
      cultural: '#ea580c',
      market: '#059669',
      sports: '#c2410c',
      technology: '#4338ca',
      science: '#0891b2'
    }
    return colors[category as keyof typeof colors] || '#6b7280'
  }

  const getStatusIcon = () => {
    if (prediction.status === 'verified') {
      return prediction.verification?.isTrue ? '✅' : '❌'
    }
    if (prediction.status === 'expired') {
      return '⏰'
    }
    return '🔮'
  }

  const handleRateClick = () => {
    if (prediction.status === 'active') {
      setShowRatingModal(true)
    }
  }

  const handleRatingSubmit = (confidence: number, rationale?: string, sourceLink?: string) => {
    if (onRate) {
      onRate(prediction.id, confidence, rationale, sourceLink)
    }
    setShowRatingModal(false)
  }

  const handleCreateSimilarClick = () => {
    if (onCreateSimilar) {
      onCreateSimilar(prediction)
    }
  }

  const handleBookmarkClick = () => {
    if (onBookmark) {
      onBookmark(prediction.id)
    }
  }

  return (
    <div className={`prediction-card ${compact ? 'compact' : ''}`}>
      <div className="card-header">
        <div className="category-badge" style={{ backgroundColor: getCategoryColor(prediction.category) }}>
          {prediction.category}
        </div>
        <div className="status-badge" data-status={prediction.status}>
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-text">
            {prediction.status === 'active' ? timeLeft : prediction.status}
          </span>
        </div>
      </div>

      <div className="author-info">
        <div className="author-avatar">
          <img 
            src={prediction.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${prediction.author.username}`} 
            alt={prediction.author.displayName}
          />
        </div>
        <div className="author-details">
          <span className="author-name">{prediction.author.displayName}</span>
          <span className="author-username">@{prediction.author.username}</span>
        </div>
        <div className="author-stats">
          <div className="stat-item">
            <span className="stat-value">{prediction.author.stats.level}</span>
            <span className="stat-label">LVL</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{Math.round(prediction.author.stats.accuracy)}%</span>
            <span className="stat-label">ACC</span>
          </div>
        </div>
      </div>

      {prediction.parentPredictionId && (
        <div className="linked-indicator">
          <span className="link-icon">🔗</span>
          <span className="link-text">Similar to another prediction</span>
        </div>
      )}

      <div className="card-content">
        <h3 className="prediction-title">{prediction.title}</h3>
        {!compact && prediction.description && (
          <p className="prediction-description">{prediction.description}</p>
        )}
        
        {prediction.context && !compact && (
          <p className="prediction-context">{prediction.context}</p>
        )}
      </div>


      {showCrowd && userPrediction && (
        <div className="crowd-comparison">
          <div className="your-prediction">
            <span className="label">Your prediction:</span>
            <span className="confidence">{userPrediction.confidence}%</span>
          </div>
          <div className="crowd-average">
            <span className="label">Crowd average:</span>
            <span className="confidence">{prediction.crowdStats.averageConfidence}%</span>
          </div>
          <div className="comparison-indicator">
            {userPrediction.confidence > prediction.crowdStats.averageConfidence ? (
              <span className="contrarian">📈 More optimistic than crowd</span>
            ) : userPrediction.confidence < prediction.crowdStats.averageConfidence ? (
              <span className="contrarian">📉 More pessimistic than crowd</span>
            ) : (
              <span className="aligned">🎯 Aligned with crowd</span>
            )}
          </div>
        </div>
      )}

      <div className="action-bar">
        <button 
          className={`action-button rate-action ${userPrediction?.lockedIn ? 'locked' : ''}`}
          onClick={handleRateClick}
          disabled={prediction.status !== 'active' && !userPrediction?.lockedIn}
        >
          <span className="action-icon">
            {userPrediction?.lockedIn ? '🔒' : '📊'}
          </span>
          <span className="action-label">
            {userPrediction?.lockedIn ? 'Rated' : 'Rate'}
          </span>
          <span className="action-count">{prediction.crowdStats.totalPredictions}</span>
        </button>

        <button 
          className="action-button fork-action"
          onClick={handleCreateSimilarClick}
        >
          <span className="action-icon">🔗</span>
          <span className="action-label">Fork</span>
          <span className="action-count">{prediction.linkedPredictions.length}</span>
        </button>

        <button 
          className={`action-button bookmark-action ${isBookmarked ? 'active' : ''}`}
          onClick={handleBookmarkClick}
        >
          <span className="action-icon">
            {isBookmarked ? '🔖' : '📑'}
          </span>
          <span className="action-label">Save</span>
          <span className="action-count">{prediction.bookmarks}</span>
        </button>

        <div className="action-button views-display">
          <span className="action-icon">👁️</span>
          <span className="action-label">Views</span>
          <span className="action-count">{prediction.views}</span>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        prediction={prediction}
        onSubmit={handleRatingSubmit}
        existingRating={userPrediction ? {
          confidence: userPrediction.confidence,
          rationale: userPrediction.rationale,
          sourceLink: userPrediction.sourceLink
        } : undefined}
      />

    </div>
  )
}

export default PredictionCard
