import mongoose from 'mongoose'

export const certificateStatuses = ['Pending', 'For review', 'For payment', 'Ready to release', 'Released']

const schema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, unique: true },
    residentId: { type: String, required: true },
    residentName: { type: String, required: true },
    typeId: { type: String, required: true },
    type: { type: String, required: true },
    purpose: { type: String, required: true },
    copies: { type: Number, default: 1, min: 1 },
    notes: { type: String, default: '' },
    fee: { type: Number, default: null },
    receipt: { type: String, default: '' },
    release: { type: String, default: 'Claim at barangay office' },
    status: { type: String, enum: certificateStatuses, default: 'Pending' },
    createdBy: { type: String, default: '' },
  },
  { timestamps: true }
)

schema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret.requestId
    delete ret._id
    delete ret.__v
    delete ret.requestId
    return ret
  },
})

export default mongoose.model('CertificateRequest', schema)
