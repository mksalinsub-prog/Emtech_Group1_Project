import crypto from 'node:crypto'
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Resident from '../models/Resident.js'
import { requireAuth, wrap } from '../middleware/auth.js'

const router = Router()

function publicUser(u) {
  return { id: String(u._id), name: u.name, email: u.email, role: u.role, residentId: u.residentId }
}

function signToken(user) {
  return jwt.sign(
    { id: String(user._id), role: user.role, residentId: user.residentId },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )
}

router.post('/login', wrap(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })
  const user = await User.findOne({ email: String(email).toLowerCase().trim() })
  const ok = user && (await bcrypt.compare(password, user.passwordHash))
  if (!ok) return res.status(401).json({ message: 'Wrong email or password' })
  res.json({ token: signToken(user), user: publicUser(user) })
}))

// Residents register themselves. The new profile starts as "For verification" until staff approve it.
router.post('/register', wrap(async (req, res) => {
  const { firstName, middleName, lastName, email, password, birthDate, sex, civilStatus, address, purok, mobile } = req.body
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' })
  }
  if (String(password).length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' })
  const cleanEmail = String(email).toLowerCase().trim()
  if (await User.findOne({ email: cleanEmail })) {
    return res.status(409).json({ message: 'This email is already registered' })
  }
  const n = (await Resident.countDocuments()) + 1
  const suffix = String(n).padStart(5, '0')
  const name = [firstName, middleName, lastName].filter(Boolean).join(' ')
  const resident = await Resident.create({
    residentId: `B607-${new Date().getFullYear()}-${suffix}`,
    name, address, purok: Number(purok), household: `HH-${suffix}`,
    birthDate, sex, civilStatus, mobile: mobile || '', email: cleanEmail,
    status: 'For verification',
  })
  const user = await User.create({
    name, email: cleanEmail,
    passwordHash: await bcrypt.hash(String(password), 10),
    role: 'resident',
    residentId: resident.residentId,
  })
  res.status(201).json({ token: signToken(user), user: publicUser(user) })
}))

// Email sending is not set up in this project, so the reset link is printed in the server console.
router.post('/forgot', wrap(async (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim()
  const user = await User.findOne({ email })
  if (user) {
    const token = crypto.randomBytes(24).toString('hex')
    user.resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')
    user.resetExpires = new Date(Date.now() + 30 * 60 * 1000)
    await user.save()
    const link = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${token}`
    console.log(`[password reset] Email is not configured. Reset link for ${email}: ${link}`)
  }
  res.json({ message: 'If that email is registered, a reset link has been sent.' })
}))

router.post('/reset', wrap(async (req, res) => {
  const { token, password } = req.body
  if (!token || !password || String(password).length < 8) {
    return res.status(400).json({ message: 'A valid link and a password of at least 8 characters are required' })
  }
  const hash = crypto.createHash('sha256').update(String(token)).digest('hex')
  const user = await User.findOne({ resetTokenHash: hash, resetExpires: { $gt: new Date() } })
  if (!user) return res.status(400).json({ message: 'This reset link is invalid or has expired' })
  user.passwordHash = await bcrypt.hash(String(password), 10)
  user.resetTokenHash = null
  user.resetExpires = null
  await user.save()
  res.json({ message: 'Password updated. You can log in now.' })
}))

router.get('/me', requireAuth, wrap(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(401).json({ message: 'Account no longer exists' })
  res.json({ user: publicUser(user) })
}))

export default router