import express from 'express'
import User from '../models/User.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)
router.use(authorize('admin'))

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json({
      status: 'success',
      results: users.length,
      data: users
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
})

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }
    res.json({
      status: 'success',
      data: user
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
})

export default router
