import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Residents from './pages/Residents'
import ResidentProfile from './pages/ResidentProfile'
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
      <Route path="/portal" element={<Portal />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/residents/:id" element={<ResidentProfile />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/certificates/new" element={<NewCertificate />} />
        <Route path="/incidents" element={<Incidents />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/inquiries" element={<Inquiries />} />
        <Route path="/allowances" element={<Allowances />} />
      </Route>
    </Routes>
  )
}