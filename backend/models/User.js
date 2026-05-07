import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const userSchema = new mongoose.Schema(
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
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    emailVerified: { type: Boolean, default: false },
    emailVerifyToken: String,
    emailVerifyExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: Date,
    active: { type: Boolean, default: true, select: false },
  },
  { timestamps: true }
)

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes
  return resetToken
}

// Generate email verify token
userSchema.methods.getEmailVerifyToken = function () {
  const verifyToken = crypto.randomBytes(32).toString('hex')
  this.emailVerifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex')
  this.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  return verifyToken
}

// Filter out inactive users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } })
  next()
})

export default mongoose.model('User', userSchema)
