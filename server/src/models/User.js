import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff', 'resident'], default: 'resident' },
    residentId: { type: String, default: null },
    resetTokenHash: { type: String, default: null },
    resetExpires: { type: Date, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)