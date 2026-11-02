import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { certificateTypes, certificateStats, requestQueue, feeLabel } from '../data/certificates'

export default function Certificates() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Certificate issuance</h1>
          <p className="muted">Process, review, and release barangay documents.</p>
        </div>
        <Link className="btn" to="/certificates/new">New request</Link>
      </div>

      <div className="stat-grid">
        {certificateStats.map((s) => (
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
          {requestQueue.map((r) => (
            <div className="row" key={r.id}>
              <div>
                <strong>{r.who}</strong>
                <div className="muted">{r.title} &middot; {r.id}</div>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
