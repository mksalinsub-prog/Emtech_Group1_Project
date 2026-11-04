import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { api, clearSession, saveSession } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    clearSession()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const data = await api('/auth/login', { method: 'POST', body: { email, password } })
      saveSession(data)
      navigate(data.user.role === 'resident' ? '/portal' : '/')
    } catch (err) {
      setError(err instanceof TypeError ? 'Cannot reach the server. Is it running on port 5000?' : err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout>
      <form className="login-card card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage today's barangay services.</p>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="login-meta">
          <label><input type="checkbox" /> Remember this device</label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign in to dashboard'}</button>
        <p className="muted" style={{ marginTop: 16 }}>
          New resident? <Link to="/register">Create a resident account</Link>
        </p>
        <p className="muted">
          Demo logins (password Password123!): admin@barangay607.example, staff@barangay607.example, maria@barangay607.example (resident)
        </p>
      </form>
    </AuthLayout>
  )
}