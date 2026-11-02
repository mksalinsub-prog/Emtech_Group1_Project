export const stats = [
  { label: 'Pending requests', value: '18', tag: '5 urgent' },
  { label: "Today's transactions", value: '42', tag: '+12%' },
  { label: 'Open complaints', value: '7', tag: '2 due' },
  { label: 'Residents on file', value: '8,426', tag: '+14' },
]

export const pendingRequests = [
  { id: 'REQ-2026-1048', title: 'Barangay Clearance', who: 'Maria L. Reyes', purpose: 'Employment', status: 'For review' },
  { id: 'REQ-2026-1047', title: 'Certificate of Indigency', who: 'Joel P. Santos', purpose: 'Medical', status: 'Pending' },
  { id: 'REQ-2026-1045', title: 'Business Clearance', who: "Liza's Store", purpose: 'Renewal', status: 'For payment' },
]

export const alerts = [
  'Allowance payout tomorrow: 84 recipients',
  '2 complaints due before 4:00 PM',
]

export const activity = [
  { text: 'Clearance approved: Maria L. Reyes', time: '10:14 AM' },
  { text: 'Profile updated: Joel P. Santos', time: '9:56 AM' },
  { text: 'Incident assigned: INC-2026-0081', time: '9:21 AM' },
]

export const quickActions = [
  { label: 'Add resident', to: '/residents' },
  { label: 'Scan QR', to: '/scan' },
  { label: 'Issue certificate', to: '/certificates/new' },
  { label: 'Log incident', to: '/incidents' },
]
