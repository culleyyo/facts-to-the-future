import React, { useState } from 'react'
import Modal from './Modal'
import type { PredictionCategory, CreatePredictionForm } from '../types'
import './PredictionModal.css'

interface PredictionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (form: CreatePredictionForm) => void
  prefillPrediction?: Partial<CreatePredictionForm>
}

const PredictionModal: React.FC<PredictionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  prefillPrediction
}) => {
  const [form, setForm] = useState<CreatePredictionForm>({
    title: prefillPrediction?.title || '',
    description: prefillPrediction?.description || '',
    category: prefillPrediction?.category || 'political',
    expirationDate: prefillPrediction?.expirationDate || '',
    context: prefillPrediction?.context || '',
    sourceLinks: prefillPrediction?.sourceLinks || ['']
  })

  const [errors, setErrors] = useState<Partial<CreatePredictionForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories: Array<{ key: PredictionCategory; label: string; emoji: string }> = [
    { key: 'political', label: 'Politics', emoji: '🏛️' },
    { key: 'entertainment', label: 'Entertainment', emoji: '🎭' },
    { key: 'cultural', label: 'Culture', emoji: '🌟' },
    { key: 'market', label: 'Markets', emoji: '📈' },
    { key: 'sports', label: 'Sports', emoji: '⚽' },
    { key: 'technology', label: 'Tech', emoji: '💻' },
    { key: 'weather', label: 'Weather', emoji: '🌤️' },
    { key: 'science', label: 'Science', emoji: '🧬' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<CreatePredictionForm> = {}

    if (!form.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (form.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters'
    } else if (form.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters'
    }

    if (form.description && form.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    if (!form.expirationDate) {
      newErrors.expirationDate = 'Expiration date is required'
    } else {
      const expirationDate = new Date(form.expirationDate)
      const now = new Date()
      const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now
      const maxDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year from now

      if (expirationDate < minDate) {
        newErrors.expirationDate = 'Expiration must be at least 24 hours from now'
      } else if (expirationDate > maxDate) {
        newErrors.expirationDate = 'Expiration cannot be more than 1 year from now'
      }
    }

    if (form.context && form.context.length > 1000) {
      newErrors.context = 'Context must be less than 1000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Filter out empty source links
      const cleanedForm = {
        ...form,
        sourceLinks: form.sourceLinks.filter(link => link.trim())
      }
      
      await onSubmit(cleanedForm)
      
      // Reset form
      setForm({
        title: '',
        description: '',
        category: 'political',
        expirationDate: '',
        context: '',
        sourceLinks: ['']
      })
      
      onClose()
    } catch (error) {
      console.error('Error submitting prediction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSourceLinkChange = (index: number, value: string) => {
    const newSourceLinks = [...form.sourceLinks]
    newSourceLinks[index] = value
    
    // Add a new empty field if the last field is filled
    if (index === newSourceLinks.length - 1 && value.trim() && newSourceLinks.length < 3) {
      newSourceLinks.push('')
    }
    
    setForm({ ...form, sourceLinks: newSourceLinks })
  }

  const removeSourceLink = (index: number) => {
    const newSourceLinks = form.sourceLinks.filter((_, i) => i !== index)
    // Ensure at least one empty field
    if (newSourceLinks.length === 0 || newSourceLinks.every(link => link.trim())) {
      newSourceLinks.push('')
    }
    setForm({ ...form, sourceLinks: newSourceLinks })
  }

  // Set default date to 7 days from now
  React.useEffect(() => {
    if (isOpen && !form.expirationDate) {
      const defaultDate = new Date()
      defaultDate.setDate(defaultDate.getDate() + 7)
      setForm(prev => ({
        ...prev,
        expirationDate: defaultDate.toISOString().slice(0, 16)
      }))
    }
  }, [isOpen, form.expirationDate])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={prefillPrediction ? '🔗 Create Similar Prediction' : '✨ Make a Prediction'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="prediction-form">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Prediction Title <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="What do you think will happen?"
            className={`form-input ${errors.title ? 'error' : ''}`}
            maxLength={200}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
          <div className="character-count">
            {form.title.length}/200
          </div>
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category <span className="required">*</span>
          </label>
          <div className="category-grid">
            {categories.map(category => (
              <button
                key={category.key}
                type="button"
                className={`category-option ${form.category === category.key ? 'selected' : ''}`}
                onClick={() => setForm({ ...form, category: category.key })}
              >
                <span className="category-emoji">{category.emoji}</span>
                <span className="category-label">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Expiration Date */}
        <div className="form-group">
          <label htmlFor="expirationDate" className="form-label">
            Resolution Date <span className="required">*</span>
          </label>
          <input
            id="expirationDate"
            type="datetime-local"
            value={form.expirationDate}
            onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
            className={`form-input ${errors.expirationDate ? 'error' : ''}`}
            min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
            max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
          />
          {errors.expirationDate && <span className="error-message">{errors.expirationDate}</span>}
          <div className="field-hint">
            When should this prediction be resolved? Must be 24 hours to 1 year from now.
          </div>
        </div>

        {/* Description (optional) */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description <span className="optional">(optional)</span>
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Add more details about your prediction..."
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            rows={3}
            maxLength={500}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
          <div className="character-count">
            {form.description.length}/500
          </div>
        </div>

        {/* Context (optional) */}
        <div className="form-group">
          <label htmlFor="context" className="form-label">
            Context <span className="optional">(optional)</span>
          </label>
          <textarea
            id="context"
            value={form.context}
            onChange={(e) => setForm({ ...form, context: e.target.value })}
            placeholder="What background information is relevant?"
            className={`form-textarea ${errors.context ? 'error' : ''}`}
            rows={3}
            maxLength={1000}
          />
          {errors.context && <span className="error-message">{errors.context}</span>}
          <div className="character-count">
            {form.context.length}/1000
          </div>
        </div>

        {/* Source Links (optional) */}
        <div className="form-group">
          <label className="form-label">
            Source Links <span className="optional">(optional)</span>
          </label>
          <div className="source-links">
            {form.sourceLinks.map((link, index) => (
              <div key={index} className="source-link-row">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handleSourceLinkChange(index, e.target.value)}
                  placeholder="https://example.com/relevant-article"
                  className="form-input"
                />
                {form.sourceLinks.length > 1 && link.trim() && (
                  <button
                    type="button"
                    onClick={() => removeSourceLink(index)}
                    className="remove-source-button"
                    aria-label="Remove source link"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="field-hint">
            Add up to 3 relevant links to support your prediction
          </div>
        </div>

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
            {isSubmitting ? 'Creating...' : 'Create Prediction'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default PredictionModal
