import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  company: {
    type: String,
    trim: true
  },
  service: {
    type: String,
    enum: ['network', 'cloud', 'endpoint', 'encryption', 'monitoring', 'incident', '']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Contact', contactSchema)
