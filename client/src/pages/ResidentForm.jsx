import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { residents } from '../data/mock'

const empty = {
  firstName: '', middleName: '', lastName: '', birthDate: '', sex: '', civilStatus: '',
  citizenship: 'Filipino', address: '', purok: '', mobile: '', email: '', idType: '', idReference: '',
}

export default function ResidentForm() {
  const { id } = useParams()
  const existing = residents.find((r) => r.id === id)
  const editing = Boolean(existing)

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
    }
  })
  const [saved, setSaved] = useState(false)

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Demo only: records are not stored until the backend is connected.
    setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="page-head">
        <div>
          <h1>{editing ? 'Edit resident' : 'Add new resident'}</h1>
          <p className="muted">{editing ? `Update ${existing.name}'s verified profile.` : 'Create a verified resident profile and household link.'}</p>
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
        </div>
        <div className="alert">Identity verification required: confirm a valid government ID and resident consent before saving.</div>

        {saved && <div className="success">Saved (demo). Records are not stored until the backend is connected.</div>}
        <div className="btn-row">
          <Link className="btn ghost" to="/residents">Back to residents</Link>
          <button className="btn" type="submit">{editing ? 'Save changes' : 'Save resident'}</button>
        </div>
      </section>
    </form>
  )
}
