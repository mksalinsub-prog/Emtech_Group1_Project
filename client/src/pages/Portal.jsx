import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import StatusBadge from '../components/StatusBadge'
import { api, getSession } from '../api'

const label = (status) => (status === 'Ready to release' ? 'Ready to claim' : status)
const peso = (n) => `\u20B1${Number(n).toFixed(2)}`

function stepsFor(r) {
  const paid = r.fee === 0 || Boolean(r.receipt)
  const done = ['Ready to release', 'Released'].includes(r.status)
  return [
    ['Request submitted', true],
    ['Payment confirmed', paid],
    ['Barangay review', done],
    ['Ready for release', done],
  ]
}

export default function Portal() {
  const residentId = getSession()?.user?.residentId
  const [person, setPerson] = useState(null)
  const [requests, setRequests] = useState(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('profile')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    Promise.all([api(`/residents/${residentId}`), api('/certificates/mine')])
      .then(([p, r]) => {
        setPerson(p)
        setRequests(r)
      })
      .catch((err) => setError(err.message))
  }, [residentId])

  if (error) return <div className="portal-body"><div className="error">{error}</div><Link to="/login">Back to login</Link></div>
  if (!person || !requests) return <div className="portal-body"><p className="muted">Loading your profile...</p></div>

  const active = requests.filter((r) => ['Pending', 'For review', 'For payment'].includes(r.status)).length
  const ready = requests.filter((r) => r.status === 'Ready to release').length
  const completed = requests.filter((r) => r.status === 'Released').length

  function openTab(name) {
    setTab(name)
    setSelected(null)
  }

  function openRequest(r) {
    setTab('requests')
    setSelected(r)
  }

  return (
    <div>
      <header className="portal-top">
        <strong>Barangay 607 Zone 61 &middot; Resident Services</strong>
        <nav className="portal-nav">
          <button className={tab === 'profile' ? 'on' : ''} onClick={() => openTab('profile')}>My profile</button>
          <button className={tab === 'requests' ? 'on' : ''} onClick={() => openTab('requests')}>My requests</button>
        </nav>
        <Link to="/login">Log out</Link>
      </header>

      <main className="portal-body">
        {tab === 'profile' && (
          <>
            <h1>Welcome, {person.name.split(' ')[0]}</h1>
            <p className="muted">View your profile and track barangay requests.</p>
            <div className="portal-grid">
              <div>
                <section className="card">
                  <h3>{person.name}</h3>
                  <p className="muted">{person.id} &middot; Household {person.household}</p>
                  <StatusBadge status={person.status === 'Active' ? 'Verified' : person.status} />
                  <p>{person.address}, Barangay 607 Zone 61</p>
                  <p className="muted">Mobile: {person.mobile || '-'}</p>
                </section>
                <section className="card qr-box">
                  <QRCodeSVG value={person.id} size={140} />
                  <p><strong>Your Barangay QR</strong></p>
                  <p className="muted">Present this for faster service. It holds only your resident ID.</p>
                </section>
              </div>
              <div>
                <div className="stat-grid three">
                  <div className="card stat"><div className="stat-value">{active}</div><div className="muted">Active requests</div></div>
                  <div className="card stat"><div className="stat-value">{ready}</div><div className="muted">Ready to claim</div></div>
                  <div className="card stat"><div className="stat-value">{completed}</div><div className="muted">Completed</div></div>
                </div>
                <section className="card">
                  <h3>My requests</h3>
                  {requests.map((r) => (
                    <button className="req-btn" key={r.id} onClick={() => openRequest(r)}>
                      <span><strong>{r.type}</strong><br /><span className="muted">{r.id}</span></span>
                      <StatusBadge status={label(r.status)} />
                    </button>
                  ))}
                  {requests.length === 0 && <p className="muted">You have no requests yet.</p>}
                </section>
                {ready > 0 && <div className="notice">Certificate ready. Bring one valid ID when claiming at the barangay hall.</div>}
              </div>
            </div>
          </>
        )}

        {tab === 'requests' && !selected && (
          <>
            <h1>My requests</h1>
            <p className="muted">Tap a request to see its progress.</p>
            <section className="card" style={{ marginTop: 16 }}>
              {requests.map((r) => (
                <button className="req-btn" key={r.id} onClick={() => setSelected(r)}>
                  <span><strong>{r.type}</strong><br /><span className="muted">{r.id} &middot; {r.purpose}</span></span>
                  <StatusBadge status={label(r.status)} />
                </button>
              ))}
              {requests.length === 0 && <p className="muted">You have no requests yet.</p>}
            </section>
          </>
        )}

        {tab === 'requests' && selected && (
          <>
            <button className="link-btn" onClick={() => setSelected(null)}>&larr; Back to my requests</button>
            <div className="page-head">
              <div>
                <h1>{selected.type}</h1>
                <p className="muted">{selected.id}</p>
              </div>
              <StatusBadge status={label(selected.status)} />
            </div>
            <div className="portal-grid">
              <section className="card">
                <h3>Request progress</h3>
                {stepsFor(selected).map(([text, done]) => (
                  <div className={`step ${done ? 'done' : ''}`} key={text}>
                    {done ? '\u2713' : '\u25CB'} {text}
                  </div>
                ))}
                <h3>Request details</h3>
                <p className="muted">Purpose: {selected.purpose}</p>
                <p className="muted">Copies: {selected.copies}</p>
                <p className="muted">Release: {selected.release}</p>
              </section>
              <section className="card">
                <h3>Payment</h3>
                {selected.fee === 0 && <p className="muted">No fee for this request.</p>}
                {selected.fee !== 0 && selected.receipt && (
                  <>
                    <p className="muted">Official receipt: {selected.receipt}</p>
                    <p className="muted">Amount: {selected.fee === null ? 'Varies' : peso(selected.fee)}</p>
                    <StatusBadge status="Paid" />
                  </>
                )}
                {selected.fee !== 0 && !selected.receipt && <p className="muted">Payment is still pending. Pay in cash at the barangay office.</p>}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  )
}