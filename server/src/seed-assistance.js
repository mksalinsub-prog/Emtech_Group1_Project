import 'dotenv/config'
import mongoose from 'mongoose'
import Inquiry from './models/Inquiry.js'
import Allowance from './models/Allowance.js'

const d = (s) => new Date(s)

const inquiries = [
  { inquiryId: 'INQ-2026-0328', residentId: 'B607-2026-01482', resident: 'Maria Lourdes Reyes', type: 'Medical', need: 'Laboratory and medicine support', urgency: 'Within 7 days', status: 'Documents needed', received: ['Valid government ID', 'Medical abstract'], updates: [{ text: 'Advised resident to upload the prescription and laboratory quotation.', at: d('2026-10-01T10:40:00+08:00') }], createdAt: d('2026-10-01T10:34:00+08:00') },
  { inquiryId: 'INQ-2026-0327', residentId: 'B607-2025-01104', resident: 'Joel P. Santos', type: 'Financial', need: 'Short-term financial support', urgency: 'Within 14 days', status: 'For assessment', received: ['Valid government ID'], updates: [], createdAt: d('2026-09-30T15:00:00+08:00') },
  { inquiryId: 'INQ-2026-0325', residentId: 'B607-2022-00494', resident: 'Liza B. Evangelista', type: 'Other', need: 'Livelihood referral', urgency: 'Flexible', status: 'Referred', received: ['Valid government ID', 'Supporting document'], updates: [{ text: 'Referred to the city livelihood program.', at: d('2026-09-29T11:00:00+08:00') }], createdAt: d('2026-09-28T09:00:00+08:00') },
  { inquiryId: 'INQ-2026-0322', residentId: 'B607-2023-00612', resident: 'Ramon D. Villanueva', type: 'Medical', need: 'Maintenance medicines', urgency: 'Within 7 days', status: 'Resolved', received: ['Valid government ID', 'Medical abstract', "Doctor's prescription", 'Laboratory quotation'], updates: [{ text: 'Medicine voucher released.', at: d('2026-09-27T14:00:00+08:00') }], createdAt: d('2026-09-25T10:00:00+08:00') },
]

const allowances = [
  { allowanceId: 'SC-2026-0118', name: 'Ramon D. Villanueva', residentId: 'B607-2023-00612', category: 'Senior Citizen', status: 'Eligible', createdAt: d('2026-09-01T09:00:00+08:00') },
  { allowanceId: 'SC-2026-0125', name: 'Elena P. Castillo', category: 'Senior Citizen', status: 'Eligible', createdAt: d('2026-09-01T09:01:00+08:00') },
  { allowanceId: 'PWD-2026-0082', name: 'Jun R. Carlos', category: 'PWD', status: 'For verification', createdAt: d('2026-09-01T09:02:00+08:00') },
  { allowanceId: 'SP-2026-0041', name: 'Angela T. Morales', category: 'Solo Parent', status: 'Eligible', createdAt: d('2026-09-01T09:03:00+08:00') },
  { allowanceId: 'PWD-2026-0084', name: 'Nestor G. Pascual', category: 'PWD', status: 'On hold', createdAt: d('2026-09-01T09:04:00+08:00') },
]

await mongoose.connect(process.env.MONGODB_URI)
await Promise.all([Inquiry.deleteMany({}), Allowance.deleteMany({})])
await Inquiry.insertMany(inquiries)
await Allowance.insertMany(allowances)
console.log('Seeded 4 inquiries and 5 allowance beneficiaries')
await mongoose.disconnect()
