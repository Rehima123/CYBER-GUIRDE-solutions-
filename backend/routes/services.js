import express from 'express'
import Service from '../models/Service.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// ── GET /api/services ────────────────────────────────
// Public — get all active services
router.get('/', async (req, res, next) => {
  try {
    const services = await Service.find({ active: true }).sort('order')
    res.json({
      status: 'success',
      results: services.length,
      data: services,
    })
  } catch (err) {
    next(err)
  }
})

// ── GET /api/services/:slug ──────────────────────────
// Public — get single service by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, active: true })
    if (!service) {
      return res.status(404).json({ status: 'error', message: 'Service not found' })
    }
    res.json({ status: 'success', data: service })
  } catch (err) {
    next(err)
  }
})

// ── POST /api/services ───────────────────────────────
// Admin — create service
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const service = await Service.create(req.body)
    res.status(201).json({ status: 'success', data: service })
  } catch (err) {
    next(err)
  }
})

// ── PUT /api/services/:id ────────────────────────────
// Admin — update service
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!service) {
      return res.status(404).json({ status: 'error', message: 'Service not found' })
    }
    res.json({ status: 'success', data: service })
  } catch (err) {
    next(err)
  }
})

// ── DELETE /api/services/:id ─────────────────────────
// Admin — soft delete (set active: false)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    )
    if (!service) {
      return res.status(404).json({ status: 'error', message: 'Service not found' })
    }
    res.json({ status: 'success', message: 'Service deactivated' })
  } catch (err) {
    next(err)
  }
})

export default router
