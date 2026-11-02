export default function StatCard({ label, value, tag }) {
  return (
    <div className="card stat">
      <span className="tag">{tag}</span>
      <div className="stat-value">{value}</div>
      <div className="muted">{label}</div>
    </div>
  )
}
