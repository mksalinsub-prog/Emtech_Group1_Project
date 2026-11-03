import { Router } from 'express'
import CertificateRequest, { certificateStatuses } from '../models/CertificateRequest.js'
import Resident from '../models/Resident.js'
import { requireAuth, requireRole, wrap } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', requireRole('admin', 'staff'), wrap(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {}
  res.json(await CertificateRequest.find(filter).sort({ createdAt: -1 }))
}))

// A resident sees only their own requests.
router.get('/mine', requireRole('resident'), wrap(async (req, res) => {
  res.json(await CertificateRequest.find({ residentId: req.user.residentId }).sort({ createdAt: -1 }))
}))

router.get('/:id', wrap(async (req, res) => {
  const doc = await CertificateRequest.findOne({ requestId: req.params.id })
  if (!doc) return res.status(404).json({ message: 'Request not found' })
  const allowed = ['admin', 'staff'].includes(req.user.role) || req.user.residentId === doc.residentId
  if (!allowed) return res.status(403).json({ message: 'You do not have access to this' })
  res.json(doc)
}))

router.post('/', requireRole('admin', 'staff'), wrap(async (req, res) => {
  const { residentId, typeId, type, purpose, copies, notes, fee, receipt, release } = req.body
  const resident = await Resident.findOne({ residentId })
  if (!resident) return res.status(400).json({ message: 'Resident not found' })
  const n = (await CertificateRequest.countDocuments()) + 1
  const paidOrFree = fee === 0 || Boolean(receipt)
  const created = await CertificateRequest.create({
    requestId: `REQ-${new Date().getFullYear()}-${String(1048 + n).padStart(4, '0')}`,
    residentId: resident.residentId,
    residentName: resident.name,
    typeId,
    type,
    purpose,
    copies: Number(copies) || 1,
    notes: notes || '',
    fee: fee === undefined ? null : fee,
    receipt: receipt || '',
    release: release || 'Claim at barangay office',
    status: paidOrFree ? 'Ready to release' : 'For payment',
    createdBy: req.user.id,
  })
  res.status(201).json(created)
}))

router.patch('/:id/status', requireRole('admin', 'staff'), wrap(async (req, res) => {
  if (!certificateStatuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' })
  const doc = await CertificateRequest.findOneAndUpdate({ requestId: req.params.id }, { status: req.body.status }, { new: true })
  if (!doc) return res.status(404).json({ message: 'Request not found' })
  res.json(doc)
}))

export default router
