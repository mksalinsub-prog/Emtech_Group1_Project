import mongoose from 'mongoose'

const residentSchema = new mongoose.Schema(
  {
    residentId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    purok: { type: Number, required: true, min: 1, max: 5 },
    household: { type: String, default: '' },
    birthDate: { type: String, required: true },
    sex: { type: String, enum: ['Female', 'Male'], required: true },
    civilStatus: { type: String, required: true },
    citizenship: { type: String, default: 'Filipino' },
    status: { type: String, enum: ['Active', 'For verification', 'Inactive'], default: 'For verification' },
    mobile: { type: String, default: '' },
    email: { type: String, default: '' },
    idType: { type: String, default: '' },
    idReference: { type: String, default: '' },
  },
  { timestamps: true }
)

// The API returns "id" (the resident ID) so the React pages can use the same shape as before.
residentSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret.residentId
    delete ret._id
    delete ret.__v
    delete ret.residentId
    return ret
  },
})

export default mongoose.model('Resident', residentSchema)
