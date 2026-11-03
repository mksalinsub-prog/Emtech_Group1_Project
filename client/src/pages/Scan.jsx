import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { api } from '../api'
import { residents as sampleResidents } from '../data/mock'

const steps = ['Scan QR', 'Resident match', 'Request details', 'Review', 'Submitted']

export default function Scan() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [match, setMatch] = useState(null)
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)

  async function handleScan(e) {
    e.preventDefault()
    setError('')
    setScanning(true)
    // The typed ID stands in for the QR payload. The API looks the resident up in MongoDB.
    try {
      const found = await api(`/residents/${encodeURIComponent(code.trim())}`)
      setMatch(found)
    } catch {
      setError('No resident matches this code. Check the ID or search by name.')
    } finally {
      setScanning(false)
    }
  }

  function reset() {
    setMatch(null)
    setCode('')
    setError('')
  }

  const current = match ? 1 : 0

  return (
    <div>
      <h1>{match ? 'Resident matched' : 'Scan resident QR'}</h1>
      <p className="muted">Start an assisted transaction without retyping resident information.</p>

      <div className="steps">
        {steps.map((s, i) => (
          <span key={s} className={`step-pill ${i === current ? 'now' : i < current ? 'past' : ''}`}>{i + 1}. {s}</span>
        ))}
      </div>

      {!match && (
        <div className="scan-grid">
          <section className="card">
            <div className={`scan-frame ${scanning ? 'busy' : ''}`}>
              <div>{scanning ? 'Reading QR profile...' : 'Camera ready'}</div>
            </div>
            <form className="scan-form" onSubmit={handleScan}>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter or paste the resident ID" required />
              <button className="btn" type="submit" disabled={scanning}>Scan</button>
            </form>
            <div className="chips">
              <span className="muted">Try:</span>
              {sampleResidents.slice(0, 3).map((r) => (
                <button key={r.id} type="button" className="chip" onClick={() => setCode(r.id)}>{r.id}</button>
              ))}
            </div>
            {error && <div className="error">{error}</div>}
          </section>
          <section className="card">
            <h3>Before scanning</h3>
            <p className="muted">1. Present the Barangay card</p>
            <p className="muted">2. Keep the code flat in the guide</p>
            <p className="muted">3. Confirm the matched resident</p>
            <p className="muted"><strong>No QR card?</strong> <Link to="/residents">Search by resident name or ID instead.</Link></p>
          </section>
        </div>
      )}

      {match && (
        <div className="scan-grid">
          <section className="card">
            <h3>{match.name}</h3>
            <p className="muted">{match.id} &middot; {match.household} &middot; {match.address}</p>
            <StatusBadge status={match.status} />
            <div className="match-info">
              <div><div className="muted">Date of birth</div><strong>{match.birthDate}</strong></div>
              <div><div className="muted">Sex / civil status</div><strong>{match.sex} &middot; {match.civilStatus}</strong></div>
              <div><div className="muted">Citizenship</div><strong>{match.citizenship}</strong></div>
            </div>
            <div className="alert">Confirm identity: ask the resident to state their full name and address.</div>
            <div className="btn-row">
              <button className="btn ghost" onClick={reset}>Scan again</button>
              <button className="btn" onClick={() => navigate('/certificates/new', { state: { resident: match } })}>Confirm and continue</button>
            </div>
          </section>
          <section className="card">
            <h3>Start a service</h3>
            <div className="service-list">
              <Link to="/certificates/new" state={{ resident: match }}>Certificate request</Link>
              <Link to="/complaints" state={{ resident: match }}>Complaint</Link>
              <Link to="/inquiries" state={{ resident: match }}>Assistance inquiry</Link>
              <Link to={`/residents/${match.id}`}>Update profile</Link>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}