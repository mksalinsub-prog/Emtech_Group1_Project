export const certificateTypes = [
  { id: 'clearance', name: 'Barangay Clearance', fee: 50, note: 'Employment, legal, general verification' },
  { id: 'indigency', name: 'Certificate of Indigency', fee: 0, note: 'Medical or financial assistance' },
  { id: 'business', name: 'Business Clearance', fee: null, note: 'New business or annual renewal' },
  { id: 'residency', name: 'Residency Certificate', fee: 30, note: 'Proof of barangay residence' },
  { id: 'barangay-id', name: 'Barangay ID', fee: 80, note: 'Resident ID and QR credential' },
  { id: 'ftjs', name: 'First-Time Job Seeker Clearance', fee: 0, note: 'RA 11261 employment document' },
]

export const certificateStats = [
  { label: 'Pending review', value: 8 },
  { label: 'For payment', value: 5 },
  { label: 'Ready to release', value: 11 },
  { label: 'Issued today', value: 27 },
]

export const requestQueue = [
  { id: 'REQ-2026-1048', who: 'Maria L. Reyes', title: 'Barangay Clearance', status: 'For review' },
  { id: 'REQ-2026-1047', who: 'Joel P. Santos', title: 'Certificate of Indigency', status: 'Pending' },
  { id: 'REQ-2026-1045', who: 'Liza B. Evangelista', title: 'Business Clearance', status: 'For payment' },
]

export function feeLabel(t) {
  if (t.fee === null) return 'Varies'
  if (t.fee === 0) return 'No fee'
  return `\u20B1${t.fee}`
}
