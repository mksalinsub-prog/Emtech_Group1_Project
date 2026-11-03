import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Resident from './models/Resident.js'
import CertificateRequest from './models/CertificateRequest.js'
import Incident from './models/Incident.js'
import Complaint from './models/Complaint.js'

const d = (s) => new Date(s)

const residents = [
  { residentId: 'B607-2026-01482', name: 'Maria Lourdes Reyes', address: '42 Sampaguita St., Purok 3', purok: 3, household: 'HH-0391', birthDate: 'April 12, 1992', sex: 'Female', civilStatus: 'Married', citizenship: 'Filipino', status: 'Active', mobile: '09171234821' },
  { residentId: 'B607-2025-01104', name: 'Joel P. Santos', address: '18 Mabini Ave., Purok 2', purok: 2, household: 'HH-1104', birthDate: 'August 3, 1985', sex: 'Male', civilStatus: 'Married', citizenship: 'Filipino', status: 'Active' },
  { residentId: 'B607-2024-00883', name: 'Andrea M. Cruz', address: '7 Rosal Rd., Purok 5', purok: 5, household: 'HH-0883', birthDate: 'January 22, 2001', sex: 'Female', civilStatus: 'Single', citizenship: 'Filipino', status: 'For verification' },
  { residentId: 'B607-2023-00612', name: 'Ramon D. Villanueva', address: '103 Rizal Ext., Purok 1', purok: 1, household: 'HH-0612', birthDate: 'June 9, 1958', sex: 'Male', civilStatus: 'Widowed', citizenship: 'Filipino', status: 'Active' },
  { residentId: 'B607-2022-00494', name: 'Liza B. Evangelista', address: '55 Narra Lane, Purok 4', purok: 4, household: 'HH-0494', birthDate: 'November 30, 1979', sex: 'Female', civilStatus: 'Separated', citizenship: 'Filipino', status: 'Inactive' },
]

const certificates = [
  { requestId: 'REQ-2026-1048', residentId: 'B607-2026-01482', residentName: 'Maria Lourdes Reyes', typeId: 'clearance', type: 'Barangay Clearance', purpose: 'Pre-employment requirement', fee: 50, receipt: 'OR-2026-8831', status: 'For review', createdAt: d('2026-10-01T09:42:00+08:00') },
  { requestId: 'REQ-2026-1047', residentId: 'B607-2025-01104', residentName: 'Joel P. Santos', typeId: 'indigency', type: 'Certificate of Indigency', purpose: 'Medical assistance', fee: 0, status: 'Pending', createdAt: d('2026-10-01T08:30:00+08:00') },
  { requestId: 'REQ-2026-1045', residentId: 'B607-2022-00494', residentName: 'Liza B. Evangelista', typeId: 'business', type: 'Business Clearance', purpose: 'Renewal', fee: null, status: 'For payment', createdAt: d('2026-09-30T14:10:00+08:00') },
  { requestId: 'REQ-2026-0784', residentId: 'B607-2026-01482', residentName: 'Maria Lourdes Reyes', typeId: 'residency', type: 'Residency Certificate', purpose: 'School enrollment', fee: 30, receipt: 'OR-2026-7710', status: 'Released', createdAt: d('2026-09-12T10:00:00+08:00') },
]

const incidents = [
  { incidentId: 'INC-2026-0081', title: 'Minor road collision', category: 'Road incident', location: 'Mabini Ave. corner Rosal Rd.', narrative: 'Two motorcycles collided. No serious injuries.', reporter: 'Ramon D. Villanueva', assignedTo: 'Peace and Order Committee', status: 'Under review', occurredAt: d('2026-10-01T08:35:00+08:00') },
  { incidentId: 'INC-2026-0080', title: 'Noise disturbance', category: 'Peace and order', location: 'Purok 5 covered court', narrative: 'Loud music past 10 PM.', reporter: 'Andrea M. Cruz', assignedTo: 'Peace and Order Committee', status: 'Resolved', occurredAt: d('2026-09-30T22:18:00+08:00') },
  { incidentId: 'INC-2026-0079', title: 'Fallen electrical line', category: 'Public safety', location: 'Narra Lane, Purok 4', narrative: 'Line fell after strong wind.', reporter: 'Liza B. Evangelista', assignedTo: 'Public Works & Sanitation', status: 'Referred', occurredAt: d('2026-09-30T16:42:00+08:00') },
  { incidentId: 'INC-2026-0078', title: 'Missing property report', category: 'Theft or loss', location: 'Barangay public market', narrative: 'Resident reports a missing bag.', reporter: 'Joel P. Santos', assignedTo: 'Peace and Order Committee', status: 'Open', occurredAt: d('2026-09-28T14:15:00+08:00') },
  { incidentId: 'INC-2026-0077', title: 'Stray dog concern', category: 'Animal concern', location: 'Sampaguita St., Purok 3', narrative: 'Stray dogs near the school gate.', reporter: 'Maria Lourdes Reyes', assignedTo: 'Health & Social Services', status: 'Resolved', occurredAt: d('2026-09-28T09:05:00+08:00') },
]

const complaints = [
  { complaintId: 'CMP-2026-0226', subject: 'Blocked drainage near residence', residentId: 'B607-2025-01104', resident: 'Joel P. Santos', purok: 2, category: 'Public works / drainage', committee: 'Public Works & Sanitation', status: 'Pending', description: 'Drainage along Mabini Avenue has remained blocked after recent rain, causing water to collect near several homes.', updates: [{ text: 'Complaint received', at: d('2026-10-01T10:08:00+08:00') }, { text: 'Assigned to Public Works & Sanitation Committee', at: d('2026-10-01T10:24:00+08:00') }] },
  { complaintId: 'CMP-2026-0227', subject: 'Recurring late-night noise', residentId: 'B607-2024-00883', resident: 'Andrea M. Cruz', purok: 5, category: 'Peace and order', committee: 'Peace and Order Committee', status: 'In progress', description: 'Loud music past 11 PM on weeknights near Rosal Road.', updates: [{ text: 'Complaint received', at: d('2026-09-29T09:10:00+08:00') }, { text: 'Tanod sent to monitor', at: d('2026-09-30T22:40:00+08:00') }] },
  { complaintId: 'CMP-2026-0224', subject: 'Boundary clarification request', residentId: 'B607-2023-00612', resident: 'Ramon D. Villanueva', purok: 1, category: 'Land and boundary', committee: 'Lupong Tagapamayapa', status: 'In progress', description: 'Resident asks for clarification of the lot boundary beside Rizal Extension.', updates: [{ text: 'Complaint received', at: d('2026-09-25T14:00:00+08:00') }, { text: 'Scheduled for mediation', at: d('2026-09-27T11:15:00+08:00') }] },
  { complaintId: 'CMP-2026-0225', subject: 'Uncollected waste concern', residentId: 'B607-2022-00494', resident: 'Liza B. Evangelista', purok: 4, category: 'Sanitation', committee: 'Public Works & Sanitation', status: 'Resolved', description: 'Garbage was not collected for three days along Narra Lane.', updates: [{ text: 'Complaint received', at: d('2026-09-26T08:30:00+08:00') }, { text: 'Collection resumed', at: d('2026-09-28T07:00:00+08:00') }] },
]

await mongoose.connect(process.env.MONGODB_URI)
await Promise.all([Resident.deleteMany({}), User.deleteMany({}), CertificateRequest.deleteMany({}), Incident.deleteMany({}), Complaint.deleteMany({})])
await Resident.insertMany(residents)
await CertificateRequest.insertMany(certificates)
await Incident.insertMany(incidents)
await Complaint.insertMany(complaints)

const passwordHash = await bcrypt.hash('Password123!', 10)
await User.insertMany([
  { name: 'Ana Mendoza', email: 'admin@barangay607.example', passwordHash, role: 'admin' },
  { name: 'Staff Encoder', email: 'staff@barangay607.example', passwordHash, role: 'staff' },
  { name: 'Maria Lourdes Reyes', email: 'maria@barangay607.example', passwordHash, role: 'resident', residentId: 'B607-2026-01482' },
])

console.log('Seeded 5 residents, 4 certificate requests, 5 incidents, 4 complaints, 3 users (password: Password123!)')
await mongoose.disconnect()
