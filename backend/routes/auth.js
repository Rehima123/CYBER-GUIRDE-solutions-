import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, company, phone } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      })
    }

    const user = await User.create({
      name,
      email,
      password,
      company,
      phone
    })

    const token = generateToken(user._id)

    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      })
    }

    const token = generateToken(user._id)

    res.json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
})

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json({
    status: 'success',
    user: req.user
  })
})

export default router
