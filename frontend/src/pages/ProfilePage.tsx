import React from 'react'
import { useParams } from 'react-router-dom'

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>()
  
  return (
    <div>
      <h1>User Profile</h1>
      <p>Placeholder for user: {username}</p>
    </div>
  )
}

export default ProfilePage
