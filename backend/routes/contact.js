import express from 'express'
import Contact from '../models/Contact.js'
import { protect, authorize } from '../middleware/auth.js'
import { contactValidator } from '../middleware/validate.js'
import { sendContactConfirmation, sendContactNotification } from '../utils/email.js'

const router = express.Router()

// ── POST /api/contact ────────────────────────────────
// Public — submit contact form
router.post('/', contactValidator, async (req, res, next) => {
  try {
    const { name, email, company, phone, service, message } = req.body

    const contact = await Contact.create({
      name,
      email,
      company,
      phone,
      service,
      message,
      ipAddress: req.ip,
    })

    // Send emails (non-blocking)
    sendContactConfirmation({ name, email, service }).catch(console.error)
    sendContactNotification({ name, email, company, phone, service, message }).catch(console.error)

    res.status(201).json({
      status: 'success',
      message: 'Your message has been received. We\'ll be in touch within 24 hours.',
      data: { id: contact._id },
    })
  } catch (err) {
    next(err)
  }
})

// ── GET /api/contact ─────────────────────────────────
// Admin — get all contacts with filters
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, sort = '-createdAt' } = req.query

    const filter = {}
    if (status) filter.status = status

    const skip = (Number(page) - 1) * Number(limit)

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Contact.countDocuments(filter),
    ])

    res.json({
      status: 'success',
      results: contacts.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: contacts,
    })
  } catch (err) {
    next(err)
  }
})

// ── GET /api/contact/:id ─────────────────────────────
// Admin — get single contact
router.get('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
      return res.status(404).json({ status: 'error', message: 'Contact not found' })
    }
    res.json({ status: 'success', data: contact })
  } catch (err) {
    next(err)
  }
})

// ── PUT /api/contact/:id ─────────────────────────────
// Admin — update contact status / notes
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { status, priority, notes } = req.body
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, priority, notes },
      { new: true, runValidators: true }
    )
    if (!contact) {
      return res.status(404).json({ status: 'error', message: 'Contact not found' })
    }
    res.json({ status: 'success', data: contact })
  } catch (err) {
    next(err)
  }
})

// ── DELETE /api/contact/:id ──────────────────────────
// Admin — delete contact
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) {
      return res.status(404).json({ status: 'error', message: 'Contact not found' })
    }
    res.json({ status: 'success', message: 'Contact deleted' })
  } catch (err) {
    next(err)
  }
})

export default router
