import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Resident from './models/Resident.js'

const residents = [
  { residentId: 'B607-2026-01482', name: 'Maria Lourdes Reyes', address: '42 Sampaguita St., Purok 3', purok: 3, household: 'HH-0391', birthDate: 'April 12, 1992', sex: 'Female', civilStatus: 'Married', citizenship: 'Filipino', status: 'Active', mobile: '09171234821' },
  { residentId: 'B607-2025-01104', name: 'Joel P. Santos', address: '18 Mabini Ave., Purok 2', purok: 2, household: 'HH-1104', birthDate: 'August 3, 1985', sex: 'Male', civilStatus: 'Married', citizenship: 'Filipino', status: 'Active' },
  { residentId: 'B607-2024-00883', name: 'Andrea M. Cruz', address: '7 Rosal Rd., Purok 5', purok: 5, household: 'HH-0883', birthDate: 'January 22, 2001', sex: 'Female', civilStatus: 'Single', citizenship: 'Filipino', status: 'For verification' },
  { residentId: 'B607-2023-00612', name: 'Ramon D. Villanueva', address: '103 Rizal Ext., Purok 1', purok: 1, household: 'HH-0612', birthDate: 'June 9, 1958', sex: 'Male', civilStatus: 'Widowed', citizenship: 'Filipino', status: 'Active' },
  { residentId: 'B607-2022-00494', name: 'Liza B. Evangelista', address: '55 Narra Lane, Purok 4', purok: 4, household: 'HH-0494', birthDate: 'November 30, 1979', sex: 'Female', civilStatus: 'Separated', citizenship: 'Filipino', status: 'Inactive' },
]

await mongoose.connect(process.env.MONGODB_URI)
await Resident.deleteMany({})
await User.deleteMany({})
await Resident.insertMany(residents)

const passwordHash = await bcrypt.hash('Password123!', 10)
await User.insertMany([
  { name: 'Ana Mendoza', email: 'admin@barangay607.example', passwordHash, role: 'admin' },
  { name: 'Staff Encoder', email: 'staff@barangay607.example', passwordHash, role: 'staff' },
  { name: 'Maria Lourdes Reyes', email: 'maria@barangay607.example', passwordHash, role: 'resident', residentId: 'B607-2026-01482' },
])

console.log('Seeded 5 residents and 3 users (password for all: Password123!)')
await mongoose.disconnect()
