import express from 'express'
import Service from '../models/Service.js'

const router = express.Router()

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ active: true })
    res.json({
      status: 'success',
      results: services.length,
      data: services
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
})

// Get single service
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug })
    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      })
    }
    res.json({
      status: 'success',
      data: service
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
})

export default router
