import React from 'react'
import { useParams } from 'react-router-dom'

const PredictionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  
  return (
    <div>
      <h1>Prediction Details</h1>
      <p>Placeholder for prediction ID: {id}</p>
    </div>
  )
}

export default PredictionPage
