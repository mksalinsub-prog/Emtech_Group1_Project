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

export const resident = {
  id: 'B607-2026-01482',
  name: 'Maria Lourdes Reyes',
  address: '42 Sampaguita St., Purok 3, Barangay 607 Zone 61',
  mobile: '09** *** 4821',
  household: 'HH-0391',
}

export const myRequests = [
  {
    id: 'REQ-2026-1048', title: 'Barangay Clearance', purpose: 'Pre-employment requirement',
    copies: 1, release: 'Claim at barangay hall', status: 'For review',
    payment: { receipt: 'OR-2026-8831', amount: '\u20B150.00', status: 'Paid' },
    steps: [['Request submitted', true], ['Payment confirmed', true], ['Barangay review', false], ['Ready for release', false]],
  },
  {
    id: 'REQ-2026-0784', title: 'Residency Certificate', purpose: 'School enrollment',
    copies: 1, release: 'Claim at barangay hall', status: 'Ready to claim',
    payment: { receipt: 'OR-2026-7710', amount: '\u20B130.00', status: 'Paid' },
    steps: [['Request submitted', true], ['Payment confirmed', true], ['Barangay review', true], ['Ready for release', true]],
  },
  {
    id: 'INQ-2026-0318', title: 'Medical Assistance Inquiry', purpose: 'Laboratory and medicine support',
    copies: '-', release: 'Barangay office', status: 'Resolved', payment: null,
    steps: [['Inquiry submitted', true], ['Documents checked', true], ['Referred and resolved', true]],
  },
export const residents = [
  { id: 'B607-2026-01482', name: 'Maria Lourdes Reyes', address: '42 Sampaguita St., Purok 3', purok: 3, household: 'HH-0391', birthDate: 'April 12, 1992', sex: 'Female', civilStatus: 'Married', citizenship: 'Filipino', status: 'Active' },
  { id: 'B607-2025-01104', name: 'Joel P. Santos', address: '18 Mabini Ave., Purok 2', purok: 2, household: 'HH-1104', birthDate: 'August 3, 1985', sex: 'Male', civilStatus: 'Married', citizenship: 'Filipino', status: 'Active' },
  { id: 'B607-2024-00883', name: 'Andrea M. Cruz', address: '7 Rosal Rd., Purok 5', purok: 5, household: 'HH-0883', birthDate: 'January 22, 2001', sex: 'Female', civilStatus: 'Single', citizenship: 'Filipino', status: 'For verification' },
  { id: 'B607-2023-00612', name: 'Ramon D. Villanueva', address: '103 Rizal Ext., Purok 1', purok: 1, household: 'HH-0612', birthDate: 'June 9, 1958', sex: 'Male', civilStatus: 'Widowed', citizenship: 'Filipino', status: 'Active' },
  { id: 'B607-2022-00494', name: 'Liza B. Evangelista', address: '55 Narra Lane, Purok 4', purok: 4, household: 'HH-0494', birthDate: 'November 30, 1979', sex: 'Female', civilStatus: 'Separated', citizenship: 'Filipino', status: 'Inactive' },
]
