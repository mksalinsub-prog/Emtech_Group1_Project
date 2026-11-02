import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState('staff')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // Placeholder login: real authentication comes with the backend.
    navigate(role === 'staff' ? '/' : '/portal')
  }

  return (
    <div className="login">
      <div className="login-hero">
        <strong>Barangay 607 Zone 61</strong>
        <h2>Faster records. Better service for every resident.</h2>
        <p>Secure resident records, requests, certificates, incidents, assistance, and QR-assisted transactions.</p>
      </div>
      <div className="login-panel">
        <form className="login-card card" onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <p className="muted">Sign in to manage today's barangay services.</p>
          <div className="role-tabs">
            <button type="button" className={role === 'staff' ? 'on' : ''} onClick={() => setRole('staff')}>Staff</button>
            <button type="button" className={role === 'resident' ? 'on' : ''} onClick={() => setRole('resident')}>Resident</button>
          </div>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="login-meta">
            <label><input type="checkbox" /> Remember this device</label>
            <Link to="/login">Forgot password?</Link>
          </div>
          <button className="btn" type="submit">Sign in to dashboard</button>
        </form>
      </div>
    </div>
  )
}
