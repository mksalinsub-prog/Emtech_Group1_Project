import { NavLink, Outlet } from 'react-router-dom'

const links = [
  ['/', 'Dashboard'],
  ['/residents', 'Residents'],
  ['/certificates', 'Certificates'],
  ['/scan', 'QR Scanner'],
  ['/incidents', 'Incidents'],
  ['/complaints', 'Complaints'],
  ['/inquiries', 'Inquiries'],
  ['/allowances', 'Allowances'],
]

export default function Layout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <strong>Barangay 607 Zone 61</strong>
          <small>Management System</small>
        </div>
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
