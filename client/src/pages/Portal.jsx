import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import StatusBadge from '../components/StatusBadge'
import { resident, myRequests } from '../data/mock'

export default function Portal() {
  const [tab, setTab] = useState('profile')
  const [selected, setSelected] = useState(null)

  const active = myRequests.filter((r) => ['For review', 'Pending'].includes(r.status)).length
  const ready = myRequests.filter((r) => r.status === 'Ready to claim').length
  const completed = myRequests.filter((r) => ['Released', 'Resolved'].includes(r.status)).length

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
            <h1>Welcome, {resident.name.split(' ')[0]}</h1>
            <p className="muted">View your profile and track barangay requests.</p>
            <div className="portal-grid">
              <div>
                <section className="card">
                  <h3>{resident.name}</h3>
                  <p className="muted">{resident.id} &middot; Household {resident.household}</p>
                  <StatusBadge status="Verified" />
                  <p>{resident.address}</p>
                  <p className="muted">Mobile: {resident.mobile}</p>
                </section>
                <section className="card qr-box">
                  <QRCodeSVG value={resident.id} size={140} />
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
                  {myRequests.map((r) => (
                    <button className="req-btn" key={r.id} onClick={() => openRequest(r)}>
                      <span><strong>{r.title}</strong><br /><span className="muted">{r.id}</span></span>
                      <StatusBadge status={r.status} />
                    </button>
                  ))}
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
              {myRequests.map((r) => (
                <button className="req-btn" key={r.id} onClick={() => setSelected(r)}>
                  <span><strong>{r.title}</strong><br /><span className="muted">{r.id} &middot; {r.purpose}</span></span>
                  <StatusBadge status={r.status} />
                </button>
              ))}
            </section>
          </>
        )}

        {tab === 'requests' && selected && (
          <>
            <button className="link-btn" onClick={() => setSelected(null)}>&larr; Back to my requests</button>
            <div className="page-head">
              <div>
                <h1>{selected.title}</h1>
                <p className="muted">{selected.id}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="portal-grid">
              <section className="card">
                <h3>Request progress</h3>
                {selected.steps.map(([label, done]) => (
                  <div className={`step ${done ? 'done' : ''}`} key={label}>
                    {done ? '\u2713' : '\u25CB'} {label}
                  </div>
                ))}
                <h3>Request details</h3>
                <p className="muted">Purpose: {selected.purpose}</p>
                <p className="muted">Copies: {selected.copies}</p>
                <p className="muted">Release: {selected.release}</p>
              </section>
              <section className="card">
                <h3>Payment</h3>
                {selected.payment ? (
                  <>
                    <p className="muted">Official receipt: {selected.payment.receipt}</p>
                    <p className="muted">Amount: {selected.payment.amount}</p>
                    <StatusBadge status={selected.payment.status} />
                  </>
                ) : (
                  <p className="muted">No fee for this request.</p>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
