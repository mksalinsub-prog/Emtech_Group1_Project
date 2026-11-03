import { Router } from 'express'
import Inquiry, { inquiryStatuses, inquiryTypes } from '../models/Inquiry.js'
import Resident from '../models/Resident.js'
import { requireAuth, requireRole, wrap } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth, requireRole('admin', 'staff'))

router.get('/', wrap(async (req, res) => {
  res.json(await Inquiry.find().sort({ createdAt: -1, inquiryId: -1 }))
}))

router.get('/:id', wrap(async (req, res) => {
  const doc = await Inquiry.findOne({ inquiryId: req.params.id })
  if (!doc) return res.status(404).json({ message: 'Inquiry not found' })
  res.json(doc)
}))

router.post('/', wrap(async (req, res) => {
  const { residentId, type, need, urgency } = req.body
  if (!inquiryTypes.includes(type)) return res.status(400).json({ message: 'Invalid assistance type' })
  const resident = await Resident.findOne({ residentId })
  if (!resident) return res.status(400).json({ message: 'Resident not found' })
  const n = (await Inquiry.countDocuments()) + 1
  const created = await Inquiry.create({
    inquiryId: `INQ-${new Date().getFullYear()}-${String(324 + n).padStart(4, '0')}`,
    residentId: resident.residentId,
    resident: resident.name,
    type, need, urgency,
    status: 'Documents needed',
    createdBy: req.user.id,
  })
  res.status(201).json(created)
}))

router.patch('/:id/status', wrap(async (req, res) => {
  if (!inquiryStatuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' })
  const doc = await Inquiry.findOneAndUpdate({ inquiryId: req.params.id }, { status: req.body.status }, { new: true })
  if (!doc) return res.status(404).json({ message: 'Inquiry not found' })
  res.json(doc)
}))

router.post('/:id/received', wrap(async (req, res) => {
  const document = String(req.body.document || '').trim()
  if (!document) return res.status(400).json({ message: 'Document name is required' })
  const doc = await Inquiry.findOneAndUpdate({ inquiryId: req.params.id }, { $addToSet: { received: document } }, { new: true })
  if (!doc) return res.status(404).json({ message: 'Inquiry not found' })
  res.json(doc)
}))

router.post('/:id/notes', wrap(async (req, res) => {
  const text = String(req.body.text || '').trim()
  if (!text) return res.status(400).json({ message: 'Note text is required' })
  const doc = await Inquiry.findOneAndUpdate({ inquiryId: req.params.id }, { $push: { updates: { text } } }, { new: true })
  if (!doc) return res.status(404).json({ message: 'Inquiry not found' })
  res.json(doc)
}))

export default router
