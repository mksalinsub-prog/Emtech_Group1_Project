import { Router } from 'express'
import Incident, { incidentStatuses } from '../models/Incident.js'
import { requireAuth, requireRole, wrap } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth, requireRole('admin', 'staff'))

router.get('/', wrap(async (req, res) => {
  res.json(await Incident.find().sort({ occurredAt: -1 }))
}))

router.post('/', wrap(async (req, res) => {
  const { title, category, priority, location, narrative, reporter, assignedTo } = req.body
  const n = (await Incident.countDocuments()) + 1
  const created = await Incident.create({
    incidentId: `INC-${new Date().getFullYear()}-${String(76 + n).padStart(4, '0')}`,
    title, category, priority, location, narrative, reporter, assignedTo,
    status: 'Open',
    createdBy: req.user.id,
  })
  res.status(201).json(created)
}))

router.patch('/:id/status', wrap(async (req, res) => {
  if (!incidentStatuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' })
  const doc = await Incident.findOneAndUpdate({ incidentId: req.params.id }, { status: req.body.status }, { new: true })
  if (!doc) return res.status(404).json({ message: 'Incident not found' })
  res.json(doc)
}))

export default router
