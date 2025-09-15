import React, { useState } from 'react'
import Modal from './Modal'
import ConfidenceSlider from './ConfidenceSlider'
import type { Prediction } from '../types'
import './RatingModal.css'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  prediction: Prediction
  onSubmit: (confidence: number, rationale?: string, sourceLink?: string) => void
  existingRating?: {
    confidence: number
    rationale?: string
    sourceLink?: string
  }
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  prediction,
  onSubmit,
  existingRating
}) => {
  const [confidence, setConfidence] = useState(existingRating?.confidence || 50)
  const [rationale, setRationale] = useState(existingRating?.rationale || '')
  const [sourceLink, setSourceLink] = useState(existingRating?.sourceLink || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ rationale?: string; sourceLink?: string }>({})

  const validateForm = (): boolean => {
    const newErrors: { rationale?: string; sourceLink?: string } = {}

    if (rationale.length > 500) {
      newErrors.rationale = 'Rationale must be less than 500 characters'
    }

    if (sourceLink && !isValidUrl(sourceLink)) {
      newErrors.sourceLink = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit(
        confidence,
        rationale.trim() || undefined,
        sourceLink.trim() || undefined
      )
      onClose()
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getConfidenceLabel = (value: number): string => {
    if (value >= 80) return 'Very Likely'
    if (value >= 60) return 'Likely'
    if (value >= 40) return 'Uncertain'
    if (value >= 20) return 'Unlikely'
    return 'Very Unlikely'
  }

  const getConfidenceColor = (value: number): string => {
    if (value >= 80) return '#059669'
    if (value >= 60) return '#65a30d'
    if (value >= 40) return '#d97706'
    if (value >= 20) return '#dc2626'
    return '#7c2d12'
  }

  const formatTimeLeft = (): string => {
    const now = new Date().getTime()
    const expiry = new Date(prediction.expirationDate).getTime()
    const distance = expiry - now

    if (distance < 0) return 'Expired'

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) {
      return `${days}d ${hours}h remaining`
    } else if (hours > 0) {
      return `${hours}h remaining`
    } else {
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      return `${minutes}m remaining`
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingRating ? '📊 Update Your Rating' : '📊 Rate This Prediction'}
      size="medium"
    >
      <div className="rating-modal">
        {/* Prediction Summary */}
        <div className="prediction-summary">
          <div className="prediction-header">
            <div className="category-badge" style={{ backgroundColor: '#6b7280' }}>
              {prediction.category}
            </div>
            <div className="time-remaining">
              ⏰ {formatTimeLeft()}
            </div>
          </div>
          
          <h3 className="prediction-title">{prediction.title}</h3>
          
          {prediction.description && (
            <p className="prediction-description">{prediction.description}</p>
          )}
          
          <div className="author-info">
            <img 
              src={prediction.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${prediction.author.username}`}
              alt={prediction.author.displayName}
              className="author-avatar"
            />
            <div className="author-details">
              <span className="author-name">{prediction.author.displayName}</span>
              <span className="author-stats">
                Level {prediction.author.stats.level} • {Math.round(prediction.author.stats.accuracy)}% accuracy
              </span>
            </div>
          </div>
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="rating-form">
          {/* Confidence Slider */}
          <div className="confidence-section">
            <div className="confidence-header">
              <label className="form-label">How likely is this to happen?</label>
              <div 
                className="confidence-display"
                style={{ color: getConfidenceColor(confidence) }}
              >
                <span className="confidence-value">{confidence}%</span>
                <span className="confidence-label">{getConfidenceLabel(confidence)}</span>
              </div>
            </div>
            
            <ConfidenceSlider
              value={confidence}
              onChange={setConfidence}
              showLabels={true}
            />
          </div>

          {/* Rationale (optional) */}
          <div className="form-group">
            <label htmlFor="rationale" className="form-label">
              Rationale <span className="optional">(optional)</span>
            </label>
            <textarea
              id="rationale"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Why do you think this prediction will or won't come true?"
              className={`form-textarea ${errors.rationale ? 'error' : ''}`}
              rows={4}
              maxLength={500}
            />
            {errors.rationale && <span className="error-message">{errors.rationale}</span>}
            <div className="character-count">
              {rationale.length}/500
            </div>
          </div>

          {/* Source Link (optional) */}
          <div className="form-group">
            <label htmlFor="sourceLink" className="form-label">
              Supporting Link <span className="optional">(optional)</span>
            </label>
            <input
              id="sourceLink"
              type="url"
              value={sourceLink}
              onChange={(e) => setSourceLink(e.target.value)}
              placeholder="https://example.com/supporting-evidence"
              className={`form-input ${errors.sourceLink ? 'error' : ''}`}
            />
            {errors.sourceLink && <span className="error-message">{errors.sourceLink}</span>}
            <div className="field-hint">
              Share a link that supports your reasoning
            </div>
          </div>

          {/* Crowd Context */}
          {prediction.crowdStats.totalPredictions > 0 && (
            <div className="crowd-context">
              <div className="crowd-header">
                <span className="crowd-title">📊 Crowd Intelligence</span>
                <span className="crowd-count">
                  {prediction.crowdStats.totalPredictions} predictions so far
                </span>
              </div>
              
              <div className="crowd-stats">
                <div className="stat-item">
                  <span className="stat-label">Average</span>
                  <span className="stat-value">{prediction.crowdStats.averageConfidence}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Confident (80%+)</span>
                  <span className="stat-value">{prediction.crowdStats.distribution.confident}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Moderate (40-79%)</span>
                  <span className="stat-value">{prediction.crowdStats.distribution.moderate}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Skeptical (0-39%)</span>
                  <span className="stat-value">{prediction.crowdStats.distribution.skeptical}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="button-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (existingRating ? 'Updating...' : 'Submitting...') 
                : (existingRating ? 'Update Rating' : 'Submit Rating')
              }
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default RatingModal
