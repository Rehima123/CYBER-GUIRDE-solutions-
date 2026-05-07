import express from 'express'
import Contact from '../models/Contact.js'
import User from '../models/User.js'
import Newsletter from '../models/Newsletter.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// All admin routes require auth + admin role
router.use(protect, authorize('admin'))

// ── GET /api/admin/stats ─────────────────────────────
// Dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalContacts,
      newContacts,
      totalUsers,
      totalSubscribers,
      recentContacts,
    ] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      User.countDocuments(),
      Newsletter.countDocuments({ active: true }),
      Contact.find().sort('-createdAt').limit(5).select('name email service status createdAt'),
    ])

    // Contacts by status
    const contactsByStatus = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    // Contacts by service
    const contactsByService = await Contact.aggregate([
      { $match: { service: { $ne: '' } } },
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // Monthly contacts (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyContacts = await Contact.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    res.json({
      status: 'success',
      data: {
        overview: {
          totalContacts,
          newContacts,
          totalUsers,
          totalSubscribers,
        },
        contactsByStatus,
        contactsByService,
        monthlyContacts,
        recentContacts,
      },
    })
  } catch (err) {
    next(err)
  }
})

export default router
