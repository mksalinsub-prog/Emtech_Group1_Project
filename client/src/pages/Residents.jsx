import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { api } from '../api'

export default function Residents() {
  const [residents, setResidents] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [purok, setPurok] = useState('all')

  useEffect(() => {
    api('/residents').then(setResidents).catch((err) => setError(err.message))
  }, [])

  if (error) return <div className="error">{error}</div>
  if (!residents) return <p className="muted">Loading residents...</p>

  const q = query.trim().toLowerCase()
  const shown = residents.filter((r) => {
    const text = [r.name, r.id, r.household, r.address].join(' ').toLowerCase()
    const matchesText = !q || text.includes(q)
    const matchesPurok = purok === 'all' || String(r.purok) === purok
    return matchesText && matchesPurok
  })

  const count = (status) => residents.filter((r) => r.status === status).length
  const households = new Set(residents.map((r) => r.household)).size

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Resident management</h1>
          <p className="muted">Search, verify, and maintain resident records across all puroks.</p>
        </div>
        <Link className="btn" to="/residents/new">Add resident</Link>
      </div>

      <div className="stat-grid">
        <div className="card stat"><div className="stat-value">{residents.length}</div><div className="muted">Total residents</div></div>
        <div className="card stat"><div className="stat-value">{count('Active')}</div><div className="muted">Active profiles</div></div>
        <div className="card stat"><div className="stat-value">{count('For verification')}</div><div className="muted">For verification</div></div>
        <div className="card stat"><div className="stat-value">{households}</div><div className="muted">Households</div></div>
      </div>

      <div className="toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, resident ID, address, or household..." />
        <select value={purok} onChange={(e) => setPurok(e.target.value)}>
          <option value="all">All puroks</option>
          {[1, 2, 3, 4, 5].map((p) => <option key={p} value={String(p)}>Purok {p}</option>)}
        </select>
      </div>

      <section className="card">
        <h3>{shown.length} resident profiles</h3>
        {shown.map((r) => (
          <Link className="row row-link" key={r.id} to={`/residents/${r.id}`}>
            <div>
              <strong>{r.name}</strong>
              <div className="muted">{r.address}</div>
            </div>
            <span className="muted">{r.id} &middot; {r.household}</span>
            <StatusBadge status={r.status} />
          </Link>
        ))}
        {shown.length === 0 && (
          <div>
            <p className="muted">No residents found. Try another name or ID, or add a new resident.</p>
            <Link className="btn" to="/residents/new">Add resident</Link>
          </div>
        )}
      </section>
    </div>
  )
}