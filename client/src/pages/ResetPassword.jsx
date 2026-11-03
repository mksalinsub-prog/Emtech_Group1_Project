import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { api } from '../api'

export default function ResetPassword() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      const data = await api('/auth/reset', { method: 'POST', body: { token, password } })
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
        <h1>Reset password</h1>
        <p className="muted">Choose a new password of at least 8 characters.</p>
        {!message && (
          <>
            <label htmlFor="password">New password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </>
        )}
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
        {!message && <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving...' : 'Reset password'}</button>}
        <p className="muted" style={{ marginTop: 16 }}><Link to="/login">Back to sign in</Link></p>
      </form>
    </AuthLayout>
  )
}