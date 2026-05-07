import express from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../middleware/validate.js'
import { sendPasswordResetEmail, sendWelcomeEmail } from '../utils/email.js'

const router = express.Router()

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' })

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id)
  res.status(statusCode).json({
    status: 'success',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
    },
  })
}

// ── POST /api/auth/register ──────────────────────────
router.post('/register', registerValidator, async (req, res, next) => {
  try {
    const { name, email, password, company, phone } = req.body

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password, company, phone })

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ name: user.name, email: user.email }).catch(console.error)

    sendTokenResponse(user, 201, res)
  } catch (err) {
    next(err)
  }
})

// ── POST /api/auth/login ─────────────────────────────
router.post('/login', loginValidator, async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    sendTokenResponse(user, 200, res)
  } catch (err) {
    next(err)
  }
})

// ── GET /api/auth/me ─────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({
    status: 'success',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      company: req.user.company,
      phone: req.user.phone,
      lastLogin: req.user.lastLogin,
      createdAt: req.user.createdAt,
    },
  })
})

// ── PUT /api/auth/update-profile ─────────────────────
router.put('/update-profile', protect, async (req, res, next) => {
  try {
    const { name, company, phone } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, company, phone },
      { new: true, runValidators: true }
    )
    res.json({ status: 'success', user })
  } catch (err) {
    next(err)
  }
})

// ── PUT /api/auth/change-password ────────────────────
router.put('/change-password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ status: 'error', message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    sendTokenResponse(user, 200, res)
  } catch (err) {
    next(err)
  }
})

// ── POST /api/auth/forgot-password ───────────────────
router.post('/forgot-password', forgotPasswordValidator, async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      // Don't reveal if email exists
      return res.json({ status: 'success', message: 'If that email exists, a reset link has been sent.' })
    }

    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    try {
      await sendPasswordResetEmail({ name: user.name, email: user.email, resetUrl })
      res.json({ status: 'success', message: 'Password reset email sent.' })
    } catch (emailErr) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save({ validateBeforeSave: false })
      return res.status(500).json({ status: 'error', message: 'Email could not be sent.' })
    }
  } catch (err) {
    next(err)
  }
})

// ── PUT /api/auth/reset-password/:token ──────────────
router.put('/reset-password/:token', resetPasswordValidator, async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Invalid or expired reset token.' })
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendTokenResponse(user, 200, res)
  } catch (err) {
    next(err)
  }
})

export default router
