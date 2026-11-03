export default function AuthLayout({ children }) {
  return (
    <div className="login">
      <div className="login-hero">
        <strong>Barangay 607 Zone 61</strong>
        <h2>Faster records. Better service for every resident.</h2>
        <p>Secure resident records, requests, certificates, incidents, assistance, and QR-assisted transactions.</p>
      </div>
      <div className="login-panel">{children}</div>
    </div>
  )
}
