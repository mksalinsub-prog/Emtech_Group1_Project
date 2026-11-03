import mongoose from 'mongoose'

export const incidentStatuses = ['Open', 'Under review', 'Referred', 'Resolved']

const schema = new mongoose.Schema(
  {
    incidentId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Other' },
    priority: { type: String, default: 'Normal' },
    location: { type: String, required: true },
    narrative: { type: String, default: '' },
    reporter: { type: String, default: '' },
    assignedTo: { type: String, default: '' },
    status: { type: String, enum: incidentStatuses, default: 'Open' },
    occurredAt: { type: Date, default: Date.now },
    createdBy: { type: String, default: '' },
  },
  { timestamps: true }
)

schema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret.incidentId
    delete ret._id
    delete ret.__v
    delete ret.incidentId
    return ret
  },
})

export default mongoose.model('Incident', schema)
