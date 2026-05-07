import mongoose from 'mongoose'

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    active: { type: Boolean, default: true },
    unsubscribeToken: String,
  },
  { timestamps: true }
)

export default mongoose.model('Newsletter', newsletterSchema)
