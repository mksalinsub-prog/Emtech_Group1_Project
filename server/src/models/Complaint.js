import mongoose from 'mongoose'

export const complaintStatuses = ['Pending', 'In progress', 'Resolved']

const updateSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
)

const schema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    residentId: { type: String, required: true },
    resident: { type: String, required: true },
    purok: { type: Number },
    category: { type: String, default: 'Other' },
    committee: { type: String, default: '' },
    status: { type: String, enum: complaintStatuses, default: 'Pending' },
    description: { type: String, default: '' },
    updates: { type: [updateSchema], default: [] },
    createdBy: { type: String, default: '' },
  },
  { timestamps: true }
)

schema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret.complaintId
    delete ret._id
    delete ret.__v
    delete ret.complaintId
    return ret
  },
})

export default mongoose.model('Complaint', schema)
