import { useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import { beneficiaries as seed, allowanceCategories } from '../data/assistance'

const peso = (n) => `\u20B1${n.toLocaleString('en-PH')}`
const prefix = { 'Senior Citizen': 'SC', PWD: 'PWD', 'Solo Parent': 'SP' }
const amount = 1000

export default function Allowances() {
  const [items, setItems] = useState(seed)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'Senior Citizen' })

  const q = query.trim().toLowerCase()
  const shown = items.filter((b) => (category === 'all' || b.category === category) && (!q || [b.name, b.id].join(' ').toLowerCase().includes(q)))
  const count = (s) => items.filter((b) => b.status === s).length
  const allocation = items.filter((b) => ['Eligible', 'Paid'].includes(b.status)).length * amount
  const attention = items.filter((b) => ['For verification', 'On hold'].includes(b.status))

  function setStatus(id, status) {
    setItems(items.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  function add(e) {
    e.preventDefault()
    const id = `${prefix[form.category]}-2026-${String(130 + items.length).padStart(4, '0')}`
    setItems([...items, { id, name: form.name, category: form.category, status: 'For verification' }])
    setForm({ name: '', category: 'Senior Citizen' })
    setShowForm(false)
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Allowance management</h1>
          <p className="muted">Verify beneficiaries, prepare payout batches, and record releases.</p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>{showForm ? 'Close form' : 'Add beneficiary'}</button>
      </div>

      {showForm && (
        <form className="card" onSubmit={add} style={{ marginBottom: 16 }}>
          <h3>Add beneficiary</h3>
          <div className="form-grid">
            <label>Full name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Category
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {allowanceCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>
          <button className="btn" type="submit">Save beneficiary</button>
        </form>
      )}

      <div className="stat-grid">
        <div className="card stat"><div className="stat-value">{count('Eligible')}</div><div className="muted">Eligible beneficiaries</div></div>
        <div className="card stat"><div className="stat-value">{count('For verification')}</div><div className="muted">For verification</div></div>
        <div className="card stat"><div className="stat-value">{peso(allocation)}</div><div className="muted">November allocation</div></div>
        <div className="card stat"><div className="stat-value">{peso(count('Paid') * amount)}</div><div className="muted">Paid this month</div></div>
      </div>

      <div className="alert">PWD and medical records are sensitive personal information. Access is limited to authorized staff.</div>

      <div className="three-col" style={{ marginTop: 16 }}>
        {allowanceCategories.map((c) => (
          <section className="card" key={c.id}>
            <h3>{c.name}</h3>
            <p className="muted">{c.rule}</p>
            <p><strong>{items.filter((b) => b.category === c.id).length}</strong> <span className="muted">beneficiaries &middot; Next payout {c.batch}</span></p>
            <button className="link-btn" onClick={() => setCategory(c.id)}>View category records</button>
          </section>
        ))}
      </div>

      <div className="toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search beneficiary, allowance ID, or category..." />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {allowanceCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="two-col">
        <section className="card">
          <h3>Beneficiary records</h3>
          {shown.map((b) => (
            <div className="row" key={b.id}>
              <div>
                <strong>{b.name}</strong>
                <div className="muted">{b.id} &middot; {b.category}</div>
              </div>
              <span className="muted">{peso(amount)}</span>
              <StatusBadge status={b.status} />
              <span>
                {b.status === 'Eligible' && <button className="link-btn" onClick={() => setStatus(b.id, 'Paid')}>Mark paid</button>}
                {b.status === 'For verification' && <button className="link-btn" onClick={() => setStatus(b.id, 'Eligible')}>Verify</button>}
                {b.status === 'On hold' && <button className="link-btn" onClick={() => setStatus(b.id, 'For verification')}>Release hold</button>}
              </span>
            </div>
          ))}
          {shown.length === 0 && <p className="muted">No beneficiaries match your search.</p>}
        </section>
        <div className="stack">
          <section className="card">
            <h3>Payout schedule</h3>
            {allowanceCategories.map((c) => (
              <div className="row" key={c.id}>
                <span>{c.batch}<div className="muted">{c.name}</div></span>
                <strong>{peso(items.filter((b) => b.category === c.id && ['Eligible', 'Paid'].includes(b.status)).length * c.amount)}</strong>
              </div>
            ))}
          </section>
          <section className="card">
            <h3>Needs attention ({attention.length})</h3>
            {attention.map((b) => (
              <div className="row" key={b.id}><span>{b.name}</span><StatusBadge status={b.status} /></div>
            ))}
            {attention.length === 0 && <p className="muted">All records are verified.</p>}
          </section>
        </div>
      </div>
    </div>
  )
}
