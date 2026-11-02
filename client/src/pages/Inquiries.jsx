import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import { residents } from '../data/mock'
import { inquiries as seed, inquiryTypes } from '../data/assistance'

const statuses = ['Documents needed', 'For assessment', 'Referred', 'Resolved']
const blank = { resident: '', type: 'Medical', need: '', urgency: 'Within 7 days' }

export default function Inquiries() {
  const [items, setItems] = useState(seed)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(blank)
  const [selectedId, setSelectedId] = useState(null)
  const [note, setNote] = useState('')

  const selected = items.find((i) => i.id === selectedId)
  const q = query.trim().toLowerCase()
  const shown = items.filter((i) => {
    const text = [i.resident, i.id, i.need].join(' ').toLowerCase()
    return (typeFilter === 'all' || i.type === typeFilter) && (!q || text.includes(q))
  })

  function patch(id, changes) {
    setItems(items.map((i) => (i.id === id ? { ...i, ...changes } : i)))
  }

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function submit(e) {
    e.preventDefault()
    const id = `INQ-2026-${String(329 + items.length - seed.length).padStart(4, '0')}`
    setItems([{ id, ...form, status: 'Documents needed', received: [], updates: [] }, ...items])
    setShowForm(false)
    setForm(blank)
    setSelectedId(id)
  }

  function addNote(e) {
    e.preventDefault()
    if (!note.trim()) return
    patch(selected.id, { updates: [...selected.updates, note.trim()] })
    setNote('')
  }

  if (showForm) {
    return (
      <form onSubmit={submit}>
        <h1>New assistance inquiry</h1>
        <p className="muted">Assistance is subject to eligibility and available funds. Assess before promising.</p>
        <section className="card" style={{ marginTop: 16 }}>
          <div className="form-grid">
            <label>Resident
              <select name="resident" value={form.resident} onChange={update} required>
                <option value="">Select resident</option>
                {residents.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
            </label>
            <label>Assistance type
              <select name="type" value={form.type} onChange={update}>
                {inquiryTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </label>
            <label>Urgency
              <select name="urgency" value={form.urgency} onChange={update}>
                <option>Within 7 days</option><option>Within 14 days</option><option>Flexible</option>
              </select>
            </label>
            <label style={{ gridColumn: '1 / -1' }}>Need<input name="need" value={form.need} onChange={update} required /></label>
          </div>
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn" type="submit">Save inquiry</button>
          </div>
        </section>
      </form>
    )
  }

  if (selected) {
    const required = inquiryTypes.find((t) => t.id === selected.type).docs
    return (
      <div>
        <button className="link-btn" onClick={() => setSelectedId(null)}>&larr; Back to inquiries</button>
        <div className="page-head">
          <div>
            <h1>{selected.type} assistance inquiry</h1>
            <p className="muted">{selected.id}</p>
          </div>
          <StatusBadge status={selected.status} />
        </div>
        <div className="scan-grid">
          <div className="stack">
            <section className="card">
              <h3>{selected.resident}</h3>
              <p className="muted">Need: {selected.need} &middot; Urgency: {selected.urgency}</p>
            </section>
            <section className="card">
              <h3>Required documents</h3>
              {required.map((d) => {
                const has = selected.received.includes(d)
                return (
                  <div className="doc-row" key={d}>
                    <span>{d}</span>
                    {has ? (
                      <StatusBadge status="Received" />
                    ) : (
                      <span>
                        <StatusBadge status="Missing" />{' '}
                        <button className="link-btn" onClick={() => patch(selected.id, { received: [...selected.received, d] })}>Mark received</button>
                      </span>
                    )}
                  </div>
                )
              })}
            </section>
            <section className="card">
              <h3>Staff notes</h3>
              {selected.updates.length === 0 && <p className="muted">No notes yet.</p>}
              {selected.updates.map((u) => <div className="timeline-item" key={u}>{u}</div>)}
              <form className="add-update" onSubmit={addNote}>
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." />
                <button className="btn" type="submit">Post update</button>
              </form>
            </section>
          </div>
          <section className="card">
            <h3>Status</h3>
            <div className="toolbar">
              <select value={selected.status} onChange={(e) => patch(selected.id, { status: e.target.value })}>
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <p className="muted">Assigned to: Health & Social Services</p>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Assistance inquiries</h1>
          <p className="muted">Guide residents to medical, financial, and other support.</p>
        </div>
        <button className="btn" onClick={() => setShowForm(true)}>New inquiry</button>
      </div>
      <div className="three-col">
        {inquiryTypes.map((t) => (
          <button key={t.id} className="case-card" onClick={() => setTypeFilter(t.id)}>
            <strong>{t.name}</strong>
            <div className="muted">{t.note}</div>
          </button>
        ))}
      </div>
      <div className="toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search inquiry, resident, or category..." />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All assistance types</option>
          {inquiryTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div className="two-col">
        <section className="card">
          <h3>Active inquiries</h3>
          {shown.map((i) => (
            <button className="req-btn" key={i.id} onClick={() => setSelectedId(i.id)}>
              <span><strong>{i.resident}</strong><br /><span className="muted">{i.type} &middot; {i.id}</span></span>
              <StatusBadge status={i.status} />
            </button>
          ))}
          {shown.length === 0 && <p className="muted">No inquiries match your search.</p>}
        </section>
        <section className="card">
          <h3>Staff quick guide</h3>
          <div className="alert">Assess before promising. Assistance is subject to eligibility and available funds.</div>
          <p className="muted">1. Identify the immediate need</p>
          <p className="muted">2. Check documents and eligibility</p>
          <p className="muted">3. Refer to the correct program</p>
          <p className="muted">4. Record the next step</p>
        </section>
      </div>
    </div>
  )
}
