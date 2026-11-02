import { Router } from 'express'
import Resident from '../models/Resident.js'
import { requireAuth, requireRole, wrap } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const fields = ['name', 'address', 'purok', 'birthDate', 'sex', 'civilStatus', 'citizenship', 'mobile', 'email', 'idType', 'idReference']
const pick = (body) => Object.fromEntries(fields.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]))
const statuses = ['Active', 'For verification', 'Inactive']

router.get('/', requireRole('admin', 'staff'), wrap(async (req, res) => {
  const filter = {}
  if (req.query.purok) filter.purok = Number(req.query.purok)
  if (req.query.status) filter.status = req.query.status
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(String(req.query.search).trim()), 'i')
    filter.$or = [{ name: rx }, { residentId: rx }, { household: rx }, { address: rx }]
  }
  res.json(await Resident.find(filter).sort({ name: 1 }))
}))

router.get('/:id', wrap(async (req, res) => {
  const allowed = ['admin', 'staff'].includes(req.user.role) || req.user.residentId === req.params.id
  if (!allowed) return res.status(403).json({ message: 'You do not have access to this' })
  const resident = await Resident.findOne({ residentId: req.params.id })
  if (!resident) return res.status(404).json({ message: 'Resident not found' })
  res.json(resident)
}))

router.post('/', requireRole('admin', 'staff'), wrap(async (req, res) => {
  const n = (await Resident.countDocuments()) + 1
  const suffix = String(n).padStart(5, '0')
  const resident = await Resident.create({
    ...pick(req.body),
    residentId: `B607-${new Date().getFullYear()}-${suffix}`,
    household: req.body.household || `HH-${suffix}`,
    status: 'For verification',
  })
  res.status(201).json(resident)
}))

router.put('/:id', requireRole('admin', 'staff'), wrap(async (req, res) => {
  const changes = pick(req.body)
  if (statuses.includes(req.body.status)) changes.status = req.body.status
  const resident = await Resident.findOneAndUpdate({ residentId: req.params.id }, changes, { new: true, runValidators: true })
  if (!resident) return res.status(404).json({ message: 'Resident not found' })
  res.json(resident)
}))

export default router
