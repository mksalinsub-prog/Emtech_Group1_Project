export default function StatusBadge({ status }) {
  const slug = status.toLowerCase().replace(/\s+/g, '-')
  return <span className={`badge ${slug}`}>{status}</span>
}
