import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import { residents } from '../data/mock'
import { complaints as seed } from '../data/cases'

const columns = ['Pending', 'In progress', 'Resolved']
const blank = { residentId: '', category: 'Public works / drainage', committee: 'Public Works & Sanitation', subject: '', description: '' }
const now = () => new Date().toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export default function Complaints() {
  const [items, setItems] = useState(seed)
  const [selectedId, setSelectedId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(blank)
  const [note, setNote] = useState('')

  const selected = items.find((c) => c.id === selectedId)
  const count = (s) => items.filter((c) => c.status === s).length

  function patch(id, changes) {
    setItems(items.map((c) => (c.id === id ? { ...c, ...changes } : c)))
  }

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function submit(e) {
    e.preventDefault()
    const person = residents.find((r) => r.id === form.residentId)
    const id = `CMP-2026-${String(228 + items.length - seed.length).padStart(4, '0')}`
    setItems([{
      id, subject: form.subject, resident: person.name, purok: person.purok, category: form.category,
      committee: form.committee, status: 'Pending', description: form.description,
      updates: [{ text: 'Complaint received', time: now() }],
    }, ...items])
    setShowForm(false)
    setForm(blank)
    setSelectedId(id)
  }

  function addUpdate(e) {
    e.preventDefault()
    if (!note.trim()) return
    patch(selected.id, {
      status: selected.status === 'Pending' ? 'In progress' : selected.status,
      updates: [...selected.updates, { text: note.trim(), time: now() }],
    })
    setNote('')
  }

  function resolve() {
    patch(selected.id, { status: 'Resolved', updates: [...selected.updates, { text: 'Marked as resolved', time: now() }] })
  }

  if (showForm) {
    return (
      <form onSubmit={submit}>
        <div className="page-head">
          <div>
            <h1>Submit complaint</h1>
            <p className="muted">Record a resident concern and route it to the responsible committee.</p>
          </div>
        </div>
        <section className="card">
          <div className="form-grid">
            <label>Resident
              <select name="residentId" value={form.residentId} onChange={update} required>
                <option value="">Select resident</option>
                {residents.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
              </select>
            </label>
            <label>Category
              <select name="category" value={form.category} onChange={update}>
                <option>Public works / drainage</option><option>Peace and order</option><option>Land and boundary</option><option>Sanitation</option><option>Other</option>
              </select>
            </label>
            <label>Committee
              <select name="committee" value={form.committee} onChange={update}>
                <option>Public Works & Sanitation</option><option>Peace and Order Committee</option><option>Lupong Tagapamayapa</option><option>Health & Social Services</option>
              </select>
            </label>
            <label style={{ gridColumn: '1 / -1' }}>Subject<input name="subject" value={form.subject} onChange={update} required /></label>
            <label style={{ gridColumn: '1 / -1' }}>Description<textarea name="description" value={form.description} onChange={update} required /></label>
          </div>
          <div className="notice">Privacy reminder: include only information needed to resolve the complaint.</div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn" type="submit">Submit complaint</button>
          </div>
        </section>
      </form>
    )
  }

  if (selected) {
    return (
      <div>
        <button className="link-btn" onClick={() => setSelectedId(null)}>&larr; Back to complaints</button>
        <div className="page-head">
          <div>
            <h1>Complaint {selected.id}</h1>
            <p className="muted">{selected.subject}</p>
          </div>
          <StatusBadge status={selected.status} />
        </div>
        <div className="scan-grid">
          <div className="stack">
            <section className="card">
              <h3>{selected.subject}</h3>
              <p>{selected.description}</p>
              <span className="badge">{selected.category}</span>
            </section>
            <section className="card">
              <h3>Tracking updates</h3>
              {selected.updates.map((u) => (
                <div className="timeline-item" key={u.time + u.text}>
                  <strong>{u.text}</strong>
                  <div className="muted">{u.time}</div>
                </div>
              ))}
              {selected.status !== 'Resolved' && (
                <form className="add-update" onSubmit={addUpdate}>
                  <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an update..." />
                  <button className="btn" type="submit">Add update</button>
                </form>
              )}
            </section>
          </div>
          <section className="card">
            <h3>{selected.resident}</h3>
            <p className="muted">Purok {selected.purok}</p>
            <div className="muted">Committee</div>
            <strong>{selected.committee}</strong>
            {selected.status !== 'Resolved' && (
              <div className="btn-row"><button className="btn" onClick={resolve}>Mark as resolved</button></div>
            )}
          </section>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Complaints management</h1>
          <p className="muted">Triage concerns, assign action owners, and keep residents updated.</p>
        </div>
        <button className="btn" onClick={() => setShowForm(true)}>Submit complaint</button>
      </div>
      <div className="stat-grid">
        {columns.map((c) => (
          <div className="card stat" key={c}><div className="stat-value">{count(c)}</div><div className="muted">{c}</div></div>
        ))}
        <div className="card stat"><div className="stat-value">{items.length}</div><div className="muted">Total complaints</div></div>
      </div>
      <div className="board">
        {columns.map((col) => (
          <section className="card" key={col}>
            <h3>{col} <span className="muted">({count(col)})</span></h3>
            {items.filter((c) => c.status === col).map((c) => (
              <button className="case-card" key={c.id} onClick={() => setSelectedId(c.id)}>
                <strong>{c.id}</strong>
                <div>{c.subject}</div>
                <div className="muted">{c.resident} &middot; Purok {c.purok}</div>
              </button>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
