import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { stats, pendingRequests, alerts, activity, quickActions } from '../data/mock'

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-PH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div>
      <p className="muted">{today}</p>
      <div className="page-head">
        <div>
          <h1>Good morning, Ana</h1>
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
          {pendingRequests.map((r) => (
            <div className="row" key={r.id}>
              <div>
                <strong>{r.title} · {r.who}</strong>
                <div className="muted">{r.id} · {r.purpose}</div>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </section>
        <div className="stack">
          <section className="card">
            <h3>Office alerts</h3>
            {alerts.map((a) => <div className="alert" key={a}>{a}</div>)}
          </section>
          <section className="card">
            <h3>Recent activity</h3>
            {activity.map((a) => (
              <div className="row" key={a.text}>
                <span>{a.text}</span>
                <span className="muted">{a.time}</span>
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
