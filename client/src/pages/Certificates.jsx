import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { api } from '../api'
import { certificateTypes, feeLabel } from '../data/certificates'

const statuses = ['Pending', 'For review', 'For payment', 'Ready to release', 'Released']

export default function Certificates() {
  const [requests, setRequests] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/certificates').then(setRequests).catch((err) => setError(err.message))
  }, [])

  async function changeStatus(id, status) {
    try {
      const updated = await api(`/certificates/${id}/status`, { method: 'PATCH', body: { status } })
      setRequests(requests.map((r) => (r.id === id ? updated : r)))
    } catch (err) {
      setError(err.message)
    }
  }

  if (!requests && !error) return <p className="muted">Loading requests...</p>
  if (!requests) return <div className="error">{error}</div>

  const count = (...list) => requests.filter((r) => list.includes(r.status)).length
  const stats = [
    { label: 'Pending review', value: count('Pending', 'For review') },
    { label: 'For payment', value: count('For payment') },
    { label: 'Ready to release', value: count('Ready to release') },
    { label: 'Released', value: count('Released') },
  ]

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Certificate issuance</h1>
          <p className="muted">Process, review, and release barangay documents.</p>
        </div>
        <Link className="btn" to="/certificates/new">New request</Link>
      </div>
      {error && <div className="error">{error}</div>}

      <div className="stat-grid">
        {stats.map((s) => (
          <div className="card stat" key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="muted">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <section className="card">
          <h3>Start a request</h3>
          <div className="type-grid">
            {certificateTypes.map((t) => (
              <Link className="type-card" key={t.id} to={`/certificates/new?type=${t.id}`}>
                <span className="fee">{feeLabel(t)}</span>
                <strong>{t.name}</strong>
                <span className="muted">{t.note}</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="card">
          <h3>Request queue</h3>
          {requests.map((r) => (
            <div className="row" key={r.id}>
              <div>
                <strong>{r.residentName}</strong>
                <div className="muted">{r.type} &middot; {r.id}</div>
              </div>
              <StatusBadge status={r.status} />
              <select value={r.status} onChange={(e) => changeStatus(r.id, e.target.value)}>
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          ))}
          {requests.length === 0 && <p className="muted">No requests yet.</p>}
        </section>
      </div>
    </div>
  )
}