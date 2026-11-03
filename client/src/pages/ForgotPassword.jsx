import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { api } from '../api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setBusy(true)
    try {
      const data = await api('/auth/forgot', { method: 'POST', body: { email } })
      setMessage(data.message)
    } catch (err) {
      setError(err instanceof TypeError ? 'Cannot reach the server. Is it running on port 5000?' : err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout>
      <form className="login-card card" onSubmit={handleSubmit}>
        <h1>Forgot password</h1>
        <p className="muted">Enter your account email and we will send a reset link.</p>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending...' : 'Send reset link'}</button>
        <p className="muted" style={{ marginTop: 16 }}>
          Demo note: email sending is not set up, so the reset link is printed in the server window.
        </p>
        <p className="muted"><Link to="/login">Back to sign in</Link></p>
      </form>
    </AuthLayout>
  )
}