import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import StatusBadge from '../components/StatusBadge'
import { residents } from '../data/mock'
import { certificateTypes, feeLabel } from '../data/certificates'

// Mock name for the demo. Replace it with the real Punong Barangay.
const punongBarangay = 'Hon. Juan D. Dela Cruz'
const steps = ['Scan QR', 'Resident match', 'Request details', 'Review', 'Submitted']

function Paper({ person, type, purpose, date }) {
  const body = type.id === 'clearance'
    ? 'is known to be of good moral character and has no derogatory record filed in this office.'
    : 'is a bona fide resident of this barangay and is requesting this certification.'
  return (
    <div className="paper">
      <div className="paper-head">
        <div>REPUBLIC OF THE PHILIPPINES</div>
        <div>CITY OF MANILA</div>
        <strong>BARANGAY 607 ZONE 61</strong>
        <div>OFFICE OF THE PUNONG BARANGAY</div>
      </div>
      <h2>{type.name.toUpperCase()}</h2>
      <p>TO WHOM IT MAY CONCERN:</p>
      <p>
        This is to certify that <strong>{person.name.toUpperCase()}</strong>, {person.citizenship}, {person.civilStatus.toLowerCase()}, and a resident of {person.address}, Barangay 607 Zone 61, City of Manila, {body}
      </p>
      <p>Issued for {purpose.toUpperCase()} this {date}.</p>
      <div className="paper-foot">
        <QRCodeSVG value={person.id} size={70} />
        <div style={{ textAlign: 'center' }}>
          <strong>{punongBarangay.toUpperCase()}</strong>
          <div className="muted">Punong Barangay</div>
        </div>
      </div>
    </div>
  )
}

export default function NewCertificate() {
  const location = useLocation()
  const [params] = useSearchParams()
  const [person, setPerson] = useState(location.state?.resident ?? null)
  const [typeId, setTypeId] = useState(params.get('type') ?? 'clearance')
  const [form, setForm] = useState({ category: 'Legal', purpose: '', copies: 1, notes: '' })
  const [step, setStep] = useState(2)
  const [receipt, setReceipt] = useState('')
  const [release, setRelease] = useState('Claim at barangay office')
  const [issued, setIssued] = useState(null)

  const type = certificateTypes.find((t) => t.id === typeId) ?? certificateTypes[0]
  const date = new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  const current = person ? step : 0
  const purpose = form.purpose || form.category

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function submitDetails(e) {
    e.preventDefault()
    setStep(3)
  }

  function issue(e) {
    e.preventDefault()
    // Demo only: requests are not stored until the backend is connected.
    setIssued({ id: `REQ-2026-${1049 + Math.floor(Math.random() * 50)}`, receipt: receipt || 'No fee' })
    setStep(4)
  }

  return (
    <div>
      <h1>New certificate request</h1>
      <p className="muted">Resident details are filled from the verified profile.</p>
      <div className="steps">
        {steps.map((s, i) => (
          <span key={s} className={`step-pill ${i === current ? 'now' : i < current ? 'past' : ''}`}>{i + 1}. {s}</span>
        ))}
      </div>

      {!person && (
        <section className="card">
          <h3>Choose a resident</h3>
          <p className="muted">Scan the resident's QR code, or pick a resident from the list.</p>
          <div className="toolbar">
            <select defaultValue="" onChange={(e) => setPerson(residents.find((r) => r.id === e.target.value) ?? null)}>
              <option value="">Select resident</option>
              {residents.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
            </select>
            <Link className="btn" to="/scan">Scan QR</Link>
          </div>
        </section>
      )}

      {person && step === 2 && (
        <form className="scan-grid" onSubmit={submitDetails}>
          <section className="card">
            <div className="form-grid">
              <label>Certificate type
                <select value={typeId} onChange={(e) => setTypeId(e.target.value)}>
                  {certificateTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </label>
            </div>
            <div className="notice">Profile data inserted. Fields from the resident profile are locked to prevent accidental changes.</div>
            <div className="form-grid">
              <label>Resident name<input value={person.name} disabled /></label>
              <label>Resident ID<input value={person.id} disabled /></label>
              <label>Address<input value={person.address} disabled /></label>
              <label>Date of birth<input value={person.birthDate} disabled /></label>
              <label>Civil status<input value={person.civilStatus} disabled /></label>
              <label>Citizenship<input value={person.citizenship} disabled /></label>
            </div>
            <h3>Certificate details</h3>
            <div className="form-grid">
              <label>Purpose category
                <select name="category" value={form.category} onChange={update}>
                  <option>Legal</option><option>Medical</option><option>Financial</option><option>Other</option>
                </select>
              </label>
              <label>Specific purpose<input name="purpose" value={form.purpose} onChange={update} placeholder="e.g. Pre-employment requirement" required /></label>
              <label>Copies<input name="copies" type="number" min="1" value={form.copies} onChange={update} /></label>
              <label style={{ gridColumn: '1 / -1' }}>Additional notes<textarea name="notes" value={form.notes} onChange={update} /></label>
            </div>
          </section>
          <section className="card">
            <h3>Request summary</h3>
            <p className="muted">Document</p>
            <strong>{type.name}</strong>
            <p className="muted">Processing: standard, same day</p>
            <p className="muted">Validity: 6 months</p>
            <div className="stat-value">{feeLabel(type)}</div>
            <div className="btn-row">
              <Link className="btn ghost" to="/certificates">Cancel</Link>
              <button className="btn" type="submit">Continue to review</button>
            </div>
          </section>
        </form>
      )}

      {person && step === 3 && (
        <form className="scan-grid" onSubmit={issue}>
          <Paper person={person} type={type} purpose={purpose} date={date} />
          <div className="stack">
            <section className="card">
              <h3>Review checklist</h3>
              <div className="checks">
                <div>&#10003; Resident details</div>
                <div>&#10003; Purpose and type</div>
                <div>&#10003; Issue date and validity</div>
                <div>&#10003; Official details</div>
              </div>
            </section>
            <section className="card">
              <h3>Payment and release</h3>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <label>Official receipt (OR) number
                  <input value={receipt} onChange={(e) => setReceipt(e.target.value)} required={type.fee !== 0} placeholder={type.fee === 0 ? 'No fee' : 'Paid in cash, e.g. OR-2026-8831'} />
                </label>
                <label>Release
                  <select value={release} onChange={(e) => setRelease(e.target.value)}>
                    <option>Claim at barangay office</option>
                    <option>Send to resident portal</option>
                  </select>
                </label>
                <label>Signatory<input value={punongBarangay} disabled /></label>
              </div>
              <div className="btn-row">
                <button type="button" className="btn ghost" onClick={() => setStep(2)}>Back to edit</button>
                <button className="btn" type="submit">Submit and issue</button>
              </div>
            </section>
          </div>
        </form>
      )}

      {person && step === 4 && issued && (
        <div>
          <section className="card no-print">
            <h3>Certificate submitted successfully</h3>
            <p className="muted">{type.name} for {person.name} is ready for printing and release.</p>
            <div className="match-info">
              <div><div className="muted">Request</div><strong>{issued.id}</strong></div>
              <div><div className="muted">Receipt</div><strong>{issued.receipt}</strong></div>
              <div><div className="muted">Status</div><StatusBadge status="Ready to release" /></div>
            </div>
            <div className="btn-row">
              <button className="btn" onClick={() => window.print()}>Print certificate</button>
              <Link className="btn ghost" to="/certificates">View queue</Link>
              <Link className="btn ghost" to="/scan">Start another</Link>
            </div>
          </section>
          <div style={{ marginTop: 16 }}>
            <Paper person={person} type={type} purpose={purpose} date={date} />
          </div>
        </div>
      )}
    </div>
  )
}
