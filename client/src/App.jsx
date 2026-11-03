import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Residents from './pages/Residents'
import ResidentProfile from './pages/ResidentProfile'
import ResidentForm from './pages/ResidentForm'
import Scan from './pages/Scan'
import Certificates from './pages/Certificates'
import NewCertificate from './pages/NewCertificate'
import Incidents from './pages/Incidents'
import Complaints from './pages/Complaints'
import Inquiries from './pages/Inquiries'
import Allowances from './pages/Allowances'
import Portal from './pages/Portal'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth roles={['resident']} />}>
        <Route path="/portal" element={<Portal />} />
      </Route>
      <Route element={<RequireAuth roles={['admin', 'staff']} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/residents/new" element={<ResidentForm />} />
          <Route path="/residents/:id/edit" element={<ResidentForm />} />
          <Route path="/residents/:id" element={<ResidentProfile />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/certificates/new" element={<NewCertificate />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/inquiries" element={<Inquiries />} />
          <Route path="/allowances" element={<Allowances />} />
        </Route>
      </Route>
    </Routes>
  )
}