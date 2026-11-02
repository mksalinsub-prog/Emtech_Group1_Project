import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { requireAuth, wrap } from '../middleware/auth.js'

const router = Router()

function publicUser(u) {
  return { id: String(u._id), name: u.name, email: u.email, role: u.role, residentId: u.residentId }
}

router.post('/login', wrap(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })
  const user = await User.findOne({ email: String(email).toLowerCase().trim() })
  const ok = user && (await bcrypt.compare(password, user.passwordHash))
  if (!ok) return res.status(401).json({ message: 'Wrong email or password' })
  const token = jwt.sign(
    { id: String(user._id), role: user.role, residentId: user.residentId },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )
  res.json({ token, user: publicUser(user) })
}))

router.get('/me', requireAuth, wrap(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(401).json({ message: 'Account no longer exists' })
  res.json({ user: publicUser(user) })
}))

export default router
