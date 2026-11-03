import { Router } from 'express'
import Complaint from '../models/Complaint.js'
import Resident from '../models/Resident.js'
import { requireAuth, requireRole, wrap } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth, requireRole('admin', 'staff'))

router.get('/', wrap(async (req, res) => {
  res.json(await Complaint.find().sort({ createdAt: -1 }))
}))

router.get('/:id', wrap(async (req, res) => {
  const doc = await Complaint.findOne({ complaintId: req.params.id })
  if (!doc) return res.status(404).json({ message: 'Complaint not found' })
  res.json(doc)
}))

router.post('/', wrap(async (req, res) => {
  const { residentId, subject, category, committee, description } = req.body
  const resident = await Resident.findOne({ residentId })
  if (!resident) return res.status(400).json({ message: 'Resident not found' })
  const n = (await Complaint.countDocuments()) + 1
  const created = await Complaint.create({
    complaintId: `CMP-${new Date().getFullYear()}-${String(223 + n).padStart(4, '0')}`,
    subject, category, committee, description,
    residentId: resident.residentId,
    resident: resident.name,
    purok: resident.purok,
    status: 'Pending',
    updates: [{ text: 'Complaint received' }],
    createdBy: req.user.id,
  })
  res.status(201).json(created)
}))

router.post('/:id/updates', wrap(async (req, res) => {
  const text = String(req.body.text || '').trim()
  if (!text) return res.status(400).json({ message: 'Update text is required' })
  const doc = await Complaint.findOne({ complaintId: req.params.id })
  if (!doc) return res.status(404).json({ message: 'Complaint not found' })
  if (doc.status === 'Resolved') return res.status(400).json({ message: 'This complaint is already resolved' })
  doc.updates.push({ text })
  if (doc.status === 'Pending') doc.status = 'In progress'
  await doc.save()
  res.json(doc)
}))

router.post('/:id/resolve', wrap(async (req, res) => {
  const doc = await Complaint.findOne({ complaintId: req.params.id })
  if (!doc) return res.status(404).json({ message: 'Complaint not found' })
  doc.updates.push({ text: 'Marked as resolved' })
  doc.status = 'Resolved'
  await doc.save()
  res.json(doc)
}))

export default router
