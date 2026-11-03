import { Router } from 'express'
import Allowance, { allowanceCategories, allowanceStatuses } from '../models/Allowance.js'
import { requireAuth, requireRole, wrap } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth, requireRole('admin', 'staff'))

const prefix = { 'Senior Citizen': 'SC', PWD: 'PWD', 'Solo Parent': 'SP' }

router.get('/', wrap(async (req, res) => {
  res.json(await Allowance.find().sort({ createdAt: 1, allowanceId: 1 }))
}))

router.post('/', wrap(async (req, res) => {
  const { name, category, residentId } = req.body
  if (!allowanceCategories.includes(category)) return res.status(400).json({ message: 'Invalid category' })
  const n = (await Allowance.countDocuments()) + 1
  const created = await Allowance.create({
    allowanceId: `${prefix[category]}-${new Date().getFullYear()}-${String(130 + n).padStart(4, '0')}`,
    name, category, residentId: residentId || '',
    status: 'For verification',
    createdBy: req.user.id,
  })
  res.status(201).json(created)
}))

router.patch('/:id/status', wrap(async (req, res) => {
  if (!allowanceStatuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' })
  const doc = await Allowance.findOneAndUpdate({ allowanceId: req.params.id }, { status: req.body.status }, { new: true })
  if (!doc) return res.status(404).json({ message: 'Beneficiary not found' })
  res.json(doc)
}))

export default router
