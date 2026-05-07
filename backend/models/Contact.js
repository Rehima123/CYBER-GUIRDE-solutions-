import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    service: {
      type: String,
      enum: ['network', 'cloud', 'endpoint', 'encryption', 'monitoring', 'incident', 'other', ''],
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'contacted', 'resolved'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    notes: { type: String }, // admin notes
    ipAddress: String,
  },
  { timestamps: true }
)

// Index for faster queries
contactSchema.index({ status: 1, createdAt: -1 })
contactSchema.index({ email: 1 })

export default mongoose.model('Contact', contactSchema)
