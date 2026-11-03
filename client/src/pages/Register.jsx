import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { api, saveSession } from '../api'

const empty = {
  firstName: '', middleName: '', lastName: '', birthDate: '', sex: '', civilStatus: '',
  address: '', purok: '', mobile: '', email: '', password: '', confirm: '',
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    setBusy(true)
    try {
      const body = { ...form }
      delete body.confirm
      const data = await api('/auth/register', { method: 'POST', body })
      saveSession(data)
      navigate('/portal')
    } catch (err) {
      setError(err instanceof TypeError ? 'Cannot reach the server. Is it running on port 5000?' : err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout>
      <form className="login-card wide card" onSubmit={handleSubmit}>
        <h1>Create a resident account</h1>
        <p className="muted">Barangay staff will verify your profile before it is marked as verified.</p>
        <div className="form-grid">
          <label>First name<input name="firstName" value={form.firstName} onChange={update} required /></label>
          <label>Middle name<input name="middleName" value={form.middleName} onChange={update} /></label>
          <label>Last name<input name="lastName" value={form.lastName} onChange={update} required /></label>
          <label>Date of birth<input name="birthDate" value={form.birthDate} onChange={update} placeholder="Month DD, YYYY" required /></label>
          <label>Sex
            <select name="sex" value={form.sex} onChange={update} required>
              <option value="">Select</option><option>Female</option><option>Male</option>
            </select>
          </label>
          <label>Civil status
            <select name="civilStatus" value={form.civilStatus} onChange={update} required>
              <option value="">Select</option><option>Single</option><option>Married</option><option>Widowed</option><option>Separated</option>
            </select>
          </label>
          <label>Address<input name="address" value={form.address} onChange={update} required /></label>
          <label>Purok
            <select name="purok" value={form.purok} onChange={update} required>
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((p) => <option key={p} value={String(p)}>Purok {p}</option>)}
            </select>
          </label>
          <label>Mobile<input name="mobile" value={form.mobile} onChange={update} /></label>
          <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
          <label>Password (8+ characters)<input name="password" type="password" value={form.password} onChange={update} required /></label>
          <label>Confirm password<input name="confirm" type="password" value={form.confirm} onChange={update} required /></label>
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
        <p className="muted" style={{ marginTop: 16 }}>Already registered? <Link to="/login">Sign in</Link></p>
      </form>
    </AuthLayout>
  )
}