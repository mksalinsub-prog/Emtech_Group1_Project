import mongoose from 'mongoose'

export const inquiryStatuses = ['Documents needed', 'For assessment', 'Referred', 'Resolved']
export const inquiryTypes = ['Medical', 'Financial', 'Other']

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
)

const schema = new mongoose.Schema(
  {
    inquiryId: { type: String, required: true, unique: true },
    residentId: { type: String, default: '' },
    resident: { type: String, required: true },
    type: { type: String, enum: inquiryTypes, required: true },
    need: { type: String, required: true },
    urgency: { type: String, default: 'Within 7 days' },
    status: { type: String, enum: inquiryStatuses, default: 'Documents needed' },
    received: { type: [String], default: [] },
    updates: { type: [noteSchema], default: [] },
    createdBy: { type: String, default: '' },
  },
  { timestamps: true }
)

schema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret.inquiryId
    delete ret._id
    delete ret.__v
    delete ret.inquiryId
    return ret
  },
})

export default mongoose.model('Inquiry', schema)
