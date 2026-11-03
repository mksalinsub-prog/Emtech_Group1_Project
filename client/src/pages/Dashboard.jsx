import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { api, getSession } from '../api'
import { quickActions } from '../data/mock'

const fmt = (iso) => new Date(iso).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
const pendingStatuses = ['Pending', 'For review', 'For payment']

export default function Dashboard() {
  const user = getSession()?.user
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api('/residents'), api('/certificates'), api('/complaints'), api('/incidents')])
      .then(([residents, certificates, complaints, incidents]) => setData({ residents, certificates, complaints, incidents }))
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <div className="error">{error}</div>
  if (!data) return <p className="muted">Loading dashboard...</p>

  const { residents, certificates, complaints, incidents } = data
  const pending = certificates.filter((r) => pendingStatuses.includes(r.status))
  const openComplaints = complaints.filter((c) => c.status !== 'Resolved')
  const openIncidents = incidents.filter((i) => ['Open', 'Under review'].includes(i.status))
  const toVerify = residents.filter((r) => r.status === 'For verification')

  const stats = [
    { label: 'Pending requests', value: String(pending.length), tag: `${certificates.filter((r) => r.status === 'For payment').length} for payment` },
    { label: 'Open incidents', value: String(openIncidents.length), tag: 'needs follow-up' },
    { label: 'Open complaints', value: String(openComplaints.length), tag: `${complaints.filter((c) => c.status === 'Pending').length} pending` },
    { label: 'Residents on file', value: String(residents.length), tag: `${toVerify.length} to verify` },
  ]

  const alerts = []
  if (toVerify.length) alerts.push(`${toVerify.length} resident profile(s) waiting for verification`)
  if (complaints.some((c) => c.status === 'Pending')) alerts.push(`${complaints.filter((c) => c.status === 'Pending').length} complaint(s) not yet assigned`)
  if (certificates.some((r) => r.status === 'For payment')) alerts.push(`${certificates.filter((r) => r.status === 'For payment').length} request(s) waiting for payment`)

  const activity = [
    ...certificates.map((r) => ({ text: `${r.type} requested: ${r.residentName}`, at: r.createdAt })),
    ...incidents.map((i) => ({ text: `Incident logged: ${i.title}`, at: i.occurredAt })),
    ...complaints.map((c) => ({ text: `Complaint received: ${c.subject}`, at: c.createdAt })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 5)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div>
      <p className="muted">{today}</p>
      <div className="page-head">
        <div>
          <h1>{greeting}, {user?.name.split(' ')[0]}</h1>
          <p className="muted">Here's what needs attention at Barangay 607 Zone 61 today.</p>
        </div>
        <Link className="btn" to="/scan">Scan resident QR</Link>
      </div>

      <div className="stat-grid">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="two-col">
        <section className="card">
          <h3>Pending requests</h3>
          {pending.slice(0, 5).map((r) => (
            <div className="row" key={r.id}>
              <div>
                <strong>{r.type} &middot; {r.residentName}</strong>
                <div className="muted">{r.id} &middot; {r.purpose}</div>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
          {pending.length === 0 && <p className="muted">No pending requests.</p>}
        </section>
        <div className="stack">
          <section className="card">
            <h3>Office alerts</h3>
            {alerts.map((a) => <div className="alert" key={a}>{a}</div>)}
            {alerts.length === 0 && <p className="muted">No alerts right now.</p>}
          </section>
          <section className="card">
            <h3>Recent activity</h3>
            {activity.map((a) => (
              <div className="row" key={a.text + a.at}>
                <span>{a.text}</span>
                <span className="muted">{fmt(a.at)}</span>
              </div>
            ))}
          </section>
        </div>
      </div>

      <h3>Quick actions</h3>
      <div className="quick">
        {quickActions.map((q) => (
          <Link className="card quick-item" key={q.label} to={q.to}>{q.label}</Link>
        ))}
      </div>
    </div>
  )
}