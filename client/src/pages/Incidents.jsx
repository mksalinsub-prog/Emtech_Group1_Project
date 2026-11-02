import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import { incidents as seed } from '../data/cases'

const blank = { category: 'Road incident', priority: 'Normal', title: '', location: '', narrative: '', reporter: '', assignedTo: 'Peace and Order Committee' }

export default function Incidents() {
  const [items, setItems] = useState(seed)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [savedId, setSavedId] = useState('')
  const [form, setForm] = useState(blank)

  const q = query.trim().toLowerCase()
  const shown = items.filter((i) => {
    const text = [i.title, i.location, i.id].join(' ').toLowerCase()
    return (status === 'all' || i.status === status) && (!q || text.includes(q))
  })
  const count = (s) => items.filter((i) => i.status === s).length

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function submit(e) {
    e.preventDefault()
    const id = `INC-2026-${String(82 + items.length - seed.length).padStart(4, '0')}`
    const date = new Date().toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    setItems([{ id, title: form.title, location: form.location, date, status: 'Open', category: form.category }, ...items])
    setSavedId(id)
    setShowForm(false)
    setForm(blank)
  }

  if (showForm) {
    return (
      <form onSubmit={submit}>
        <div className="page-head">
          <div>
            <h1>Log new incident</h1>
            <p className="muted">Capture the occurrence, people involved, and initial response.</p>
          </div>
        </div>
        <section className="card">
          <div className="alert">For emergencies, contact responders first. This form records the official incident report.</div>
          <div className="form-grid">
            <label>Category
              <select name="category" value={form.category} onChange={update}>
                <option>Road incident</option><option>Peace and order</option><option>Public safety</option><option>Theft or loss</option><option>Animal concern</option><option>Other</option>
              </select>
            </label>
            <label>Priority
              <select name="priority" value={form.priority} onChange={update}>
                <option>Low</option><option>Normal</option><option>High</option><option>Urgent</option>
              </select>
            </label>
            <label>Assign to
              <select name="assignedTo" value={form.assignedTo} onChange={update}>
                <option>Peace and Order Committee</option><option>Public Works & Sanitation</option><option>Health & Social Services</option>
              </select>
            </label>
            <label style={{ gridColumn: '1 / -1' }}>Incident title<input name="title" value={form.title} onChange={update} required /></label>
            <label style={{ gridColumn: '1 / -1' }}>Location<input name="location" value={form.location} onChange={update} required /></label>
            <label style={{ gridColumn: '1 / -1' }}>Incident narrative<textarea name="narrative" value={form.narrative} onChange={update} required /></label>
            <label>Reporting person<input name="reporter" value={form.reporter} onChange={update} required /></label>
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn" type="submit">Submit incident report</button>
          </div>
        </section>
      </form>
    )
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Incident reports</h1>
          <p className="muted">Log occurrences, coordinate response, and keep a history.</p>
        </div>
        <button className="btn" onClick={() => setShowForm(true)}>Log new incident</button>
      </div>
      {savedId && <div className="success">Incident {savedId} logged (demo). It resets on refresh until the backend is connected.</div>}

      <div className="stat-grid">
        {['Open', 'Under review', 'Referred', 'Resolved'].map((s) => (
          <div className="card stat" key={s}><div className="stat-value">{count(s)}</div><div className="muted">{s}</div></div>
        ))}
      </div>

      <div className="toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search incident ID, location, or keyword..." />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {['Open', 'Under review', 'Referred', 'Resolved'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <section className="card">
        <h3>Incident history</h3>
        {shown.map((i) => (
          <div className="row" key={i.id}>
            <div>
              <strong>{i.title}</strong>
              <div className="muted">{i.location}</div>
            </div>
            <span className="muted">{i.id} &middot; {i.date}</span>
            <StatusBadge status={i.status} />
          </div>
        ))}
        {shown.length === 0 && <p className="muted">No incidents match your search.</p>}
      </section>
    </div>
  )
}
