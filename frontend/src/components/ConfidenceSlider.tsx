import React from 'react'
import './ConfidenceSlider.css'

interface ConfidenceSliderProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  showPercentage?: boolean
  showLabels?: boolean
}

const ConfidenceSlider: React.FC<ConfidenceSliderProps> = ({
  value,
  onChange,
  disabled = false,
  showPercentage = true,
  showLabels = false
}) => {

  const getColorForValue = (confidence: number) => {
    if (confidence >= 80) return '#22c55e' // Green for high confidence
    if (confidence >= 60) return '#eab308' // Yellow for moderate confidence  
    if (confidence >= 40) return '#f97316' // Orange for low-moderate confidence
    return '#ef4444' // Red for low confidence
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'Very Confident'
    if (confidence >= 60) return 'Confident'
    if (confidence >= 40) return 'Somewhat Confident'
    return 'Not Confident'
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value)
    onChange(newValue)
  }

  return (
    <div className="confidence-slider">
      <div className="slider-container">
        <label className="slider-label">
          How confident are you this will happen?
        </label>
        
        <div className="slider-wrapper">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleSliderChange}
            disabled={disabled}
            className="slider"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #22c55e 100%)`,
              '--thumb-color': getColorForValue(value)
            } as React.CSSProperties}
          />
          
          <div className="slider-track-background"></div>
        </div>

        <div className="slider-info">
          <div className="confidence-display">
            {showPercentage && (
              <span className="confidence-percentage" style={{ color: getColorForValue(value) }}>
                {value}%
              </span>
            )}
            <span className="confidence-label" style={{ color: getColorForValue(value) }}>
              {getConfidenceLabel(value)}
            </span>
          </div>
          
          {showLabels && (
            <div className="slider-labels">
              <span className="min-label">Not happening</span>
              <span className="max-label">Definitely happening</span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default ConfidenceSlider
