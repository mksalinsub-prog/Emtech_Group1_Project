import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import residentRoutes from './routes/residents.js'
import certificateRoutes from './routes/certificates.js'
import incidentRoutes from './routes/incidents.js'
import complaintRoutes from './routes/complaints.js'
import inquiryRoutes from './routes/inquiries.js'
import allowanceRoutes from './routes/allowances.js'

const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/residents', residentRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/incidents', incidentRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/allowances', allowanceRoutes)

app.use((req, res) => res.status(404).json({ message: 'Not found' }))
app.use((err, req, res, next) => {
  console.error(err)
  const status = err.name === 'ValidationError' ? 400 : err.status || 500
  res.status(status).json({ message: err.message || 'Server error' })
})

const port = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(port, () => console.log(`API running on http://localhost:${port}`))
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })
