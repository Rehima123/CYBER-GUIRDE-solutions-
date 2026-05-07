import express from 'express'
import User from '../models/User.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// All routes require auth + admin
router.use(protect, authorize('admin'))

// ── GET /api/users ───────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, sort = '-createdAt' } = req.query
    const filter = {}
    if (role) filter.role = role

    const skip = (Number(page) - 1) * Number(limit)
    const [users, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ])

    res.json({
      status: 'success',
      results: users.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      data: users,
    })
  } catch (err) {
    next(err)
  }
})

// ── GET /api/users/:id ───────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' })
    res.json({ status: 'success', data: user })
  } catch (err) {
    next(err)
  }
})

// ── PUT /api/users/:id ───────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    // Don't allow password update through this route
    const { password, ...updateData } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' })
    res.json({ status: 'success', data: user })
  } catch (err) {
    next(err)
  }
})

// ── DELETE /api/users/:id ────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    // Prevent deleting yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ status: 'error', message: 'Cannot delete your own account' })
    }
    const user = await User.findByIdAndUpdate(req.params.id, { active: false }, { new: true })
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' })
    res.json({ status: 'success', message: 'User deactivated' })
  } catch (err) {
    next(err)
  }
})

export default router
