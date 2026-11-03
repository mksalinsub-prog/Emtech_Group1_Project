import { useEffect, useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import { api } from '../api'

const statuses = ['Open', 'Under review', 'Referred', 'Resolved']
const blank = { category: 'Road incident', priority: 'Normal', title: '', location: '', narrative: '', reporter: '', assignedTo: 'Peace and Order Committee' }
const fmt = (iso) => new Date(iso).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export default function Incidents() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [savedId, setSavedId] = useState('')
  const [form, setForm] = useState(blank)

  useEffect(() => {
    api('/incidents').then(setItems).catch((err) => setError(err.message))
  }, [])

  async function changeStatus(id, next) {
    try {
      const updated = await api(`/incidents/${id}/status`, { method: 'PATCH', body: { status: next } })
      setItems(items.map((i) => (i.id === id ? updated : i)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const created = await api('/incidents', { method: 'POST', body: form })
      setItems([created, ...items])
      setSavedId(created.id)
      setShowForm(false)
      setForm(blank)
    } catch (err) {
      setError(err.message)
    }
  }

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  if (!items && !error) return <p className="muted">Loading incidents...</p>
  if (!items) return <div className="error">{error}</div>

  const q = query.trim().toLowerCase()
  const shown = items.filter((i) => {
    const text = [i.title, i.location, i.id].join(' ').toLowerCase()
    return (status === 'all' || i.status === status) && (!q || text.includes(q))
  })
  const count = (s) => items.filter((i) => i.status === s).length

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
          {error && <div className="error">{error}</div>}
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
      {savedId && <div className="success">Incident {savedId} saved to the database.</div>}
      {error && <div className="error">{error}</div>}

      <div className="stat-grid">
        {statuses.map((s) => (
          <div className="card stat" key={s}><div className="stat-value">{count(s)}</div><div className="muted">{s}</div></div>
        ))}
      </div>

      <div className="toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search incident ID, location, or keyword..." />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {statuses.map((s) => <option key={s}>{s}</option>)}
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
            <span className="muted">{i.id} &middot; {fmt(i.occurredAt)}</span>
            <StatusBadge status={i.status} />
            <select value={i.status} onChange={(e) => changeStatus(i.id, e.target.value)}>
              {statuses.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        ))}
        {shown.length === 0 && <p className="muted">No incidents match your search.</p>}
      </section>
    </div>
  )
}