import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  features: [String],
  price: {
    type: Number,
    required: true
  },
  duration: String,
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Service', serviceSchema)
