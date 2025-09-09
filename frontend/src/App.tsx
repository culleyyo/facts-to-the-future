import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import SubmitPage from './pages/SubmitPage'
import PredictionPage from './pages/PredictionPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="submit" element={<SubmitPage />} />
          <Route path="prediction/:id" element={<PredictionPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App