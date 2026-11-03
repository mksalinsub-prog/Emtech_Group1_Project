import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import StatusBadge from '../components/StatusBadge'
import { api } from '../api'

export default function ResidentProfile() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api(`/residents/${id}`).then(setPerson).catch((err) => setError(err.message))
    api('/certificates')
      .then((all) => setHistory(all.filter((r) => r.residentId === id)))
      .catch(() => setHistory([]))
  }, [id])

  if (error) {
    return (
      <div>
        <h1>Resident not found</h1>
        <p className="muted">{error}</p>
        <Link className="btn" to="/residents">Back to residents</Link>
      </div>
    )
  }
  if (!person) return <p className="muted">Loading profile...</p>

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Resident profile</h1>
          <p className="muted">Resident record and transaction history.</p>
        </div>
        <div className="btn-row">
          <Link className="btn ghost" to={`/residents/${person.id}/edit`}>Edit profile</Link>
          <Link className="btn" to="/certificates/new" state={{ resident: person }}>New request</Link>
        </div>
      </div>

      <div className="scan-grid">
        <div className="stack">
          <section className="card">
            <h3>{person.name}</h3>
            <p className="muted">{person.id} &middot; Household {person.household}</p>
            <StatusBadge status={person.status} />
            <div className="match-info">
              <div><div className="muted">Date of birth</div><strong>{person.birthDate}</strong></div>
              <div><div className="muted">Sex / civil status</div><strong>{person.sex} &middot; {person.civilStatus}</strong></div>
              <div><div className="muted">Citizenship</div><strong>{person.citizenship}</strong></div>
            </div>
            <div className="muted">Address</div>
            <strong>{person.address}, Barangay 607 Zone 61</strong>
            <div className="muted" style={{ marginTop: 10 }}>Mobile</div>
            <strong>{person.mobile || '-'}</strong>
          </section>
          <section className="card">
            <h3>Recent transactions</h3>
            {history.length === 0 && <p className="muted">No transactions yet.</p>}
            {history.map((r) => (
              <div className="row" key={r.id}>
                <div>
                  <strong>{r.type}</strong>
                  <div className="muted">{r.id} &middot; {r.purpose}</div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </section>
        </div>
        <section className="card qr-box">
          <QRCodeSVG value={person.id} size={140} />
          <p><strong>{person.id}</strong></p>
          <p className="muted">Resident QR. It holds only the resident ID.</p>
        </section>
      </div>
    </div>
  )
}