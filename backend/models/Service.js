import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDesc: { type: String, required: true },
    description: { type: String, required: true },
    features: [String],
    icon: { type: String, default: 'FaShieldAlt' },
    price: {
      monthly: { type: Number, default: 0 },
      yearly: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
    },
    category: {
      type: String,
      enum: ['network', 'cloud', 'endpoint', 'encryption', 'monitoring', 'incident'],
    },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

serviceSchema.index({ slug: 1 })
serviceSchema.index({ active: 1, order: 1 })

export default mongoose.model('Service', serviceSchema)
