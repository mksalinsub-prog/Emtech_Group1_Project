import mongoose from 'mongoose'

export const allowanceCategories = ['Senior Citizen', 'PWD', 'Solo Parent']
export const allowanceStatuses = ['Eligible', 'For verification', 'On hold', 'Paid']

const schema = new mongoose.Schema(
  {
    allowanceId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    residentId: { type: String, default: '' },
    category: { type: String, enum: allowanceCategories, required: true },
    status: { type: String, enum: allowanceStatuses, default: 'For verification' },
    amount: { type: Number, default: 1000 },
    createdBy: { type: String, default: '' },
  },
  { timestamps: true }
)

schema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret.allowanceId
    delete ret._id
    delete ret.__v
    delete ret.allowanceId
    return ret
  },
})

export default mongoose.model('Allowance', schema)
