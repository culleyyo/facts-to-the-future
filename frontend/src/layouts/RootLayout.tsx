import React from 'react'
import { Outlet, Link } from 'react-router-dom'

const RootLayout: React.FC = () => {
  return (
    <div>
      <header>
        <h1>Facts to the Future</h1>
        <nav>
          <Link to="/">Feed</Link>
          <Link to="/submit">Submit</Link>
          <Link to="/profile/demo">Profile</Link>
        </nav>
      </header>
      
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout
