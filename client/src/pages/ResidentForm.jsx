import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const empty = {
  firstName: '', middleName: '', lastName: '', birthDate: '', sex: '', civilStatus: '',
  citizenship: 'Filipino', address: '', purok: '', mobile: '', email: '', idType: '', idReference: '',
  status: 'For verification',
}

function FormBody({ existing }) {
  const navigate = useNavigate()
  const editing = Boolean(existing)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState(() => {
    if (!existing) return empty
    const parts = existing.name.split(' ')
    return {
      ...empty,
      firstName: parts.slice(0, -1).join(' '),
      lastName: parts[parts.length - 1],
      birthDate: existing.birthDate,
      sex: existing.sex,
      civilStatus: existing.civilStatus,
      citizenship: existing.citizenship,
      address: existing.address,
      purok: String(existing.purok),
      mobile: existing.mobile || '',
      email: existing.email || '',
      idType: existing.idType || '',
      idReference: existing.idReference || '',
      status: existing.status,
    }
  })

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const body = {
      name: [form.firstName, form.middleName, form.lastName].filter(Boolean).join(' '),
      address: form.address,
      purok: Number(form.purok),
      birthDate: form.birthDate,
      sex: form.sex,
      civilStatus: form.civilStatus,
      citizenship: form.citizenship,
      mobile: form.mobile,
      email: form.email,
      idType: form.idType,
      idReference: form.idReference,
    }
    if (editing) body.status = form.status
    try {
      const saved = editing
        ? await api(`/residents/${existing.id}`, { method: 'PUT', body })
        : await api('/residents', { method: 'POST', body })
      navigate(`/residents/${saved.id}`)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="page-head">
        <div>
          <h1>{editing ? 'Edit resident' : 'Add new resident'}</h1>
          <p className="muted">{editing ? `Update ${existing.name}'s verified profile.` : 'Create a resident profile. New residents start as "For verification".'}</p>
        </div>
        {editing && <span className="badge">{existing.id}</span>}
      </div>

      <section className="card">
        <h3>Personal information</h3>
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
          <label>Citizenship<input name="citizenship" value={form.citizenship} onChange={update} /></label>
        </div>

        <h3>Address and contact</h3>
        <div className="form-grid">
          <label>Address<input name="address" value={form.address} onChange={update} required /></label>
          <label>Purok
            <select name="purok" value={form.purok} onChange={update} required>
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((p) => <option key={p} value={String(p)}>Purok {p}</option>)}
            </select>
          </label>
          <label>Mobile<input name="mobile" value={form.mobile} onChange={update} /></label>
          <label>Email<input name="email" type="email" value={form.email} onChange={update} /></label>
        </div>

        <h3>Identity verification</h3>
        <div className="form-grid">
          <label>ID type
            <select name="idType" value={form.idType} onChange={update}>
              <option value="">Select ID</option><option>PhilSys ID</option><option>Driver's license</option><option>Passport</option><option>Voter's ID</option>
            </select>
          </label>
          <label>ID reference<input name="idReference" value={form.idReference} onChange={update} /></label>
          {editing && (
            <label>Status
              <select name="status" value={form.status} onChange={update}>
                <option>Active</option><option>For verification</option><option>Inactive</option>
              </select>
            </label>
          )}
        </div>
        <div className="alert">Identity verification required: confirm a valid government ID and resident consent before saving.</div>

        {error && <div className="error">{error}</div>}
        <div className="btn-row">
          <Link className="btn ghost" to="/residents">Back to residents</Link>
          <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving...' : editing ? 'Save changes' : 'Save resident'}</button>
        </div>
      </section>
    </form>
  )
}

export default function ResidentForm() {
  const { id } = useParams()
  const [existing, setExisting] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api(`/residents/${id}`).then(setExisting).catch((err) => setError(err.message))
  }, [id])

  if (error) {
    return (
      <div>
        <h1>Resident not found</h1>
        <p className="muted">{error}</p>
        <Link className="btn" to="/residents">Back to residents</Link>
      </div>
    )
  }
  if (id && !existing) return <p className="muted">Loading...</p>
  return <FormBody existing={existing} />
}