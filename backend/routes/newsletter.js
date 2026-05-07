import express from 'express'
import crypto from 'crypto'
import Newsletter from '../models/Newsletter.js'
import { protect, authorize } from '../middleware/auth.js'
import { newsletterValidator } from '../middleware/validate.js'
import { sendEmail } from '../utils/email.js'

const router = express.Router()

// ── POST /api/newsletter/subscribe ───────────────────
router.post('/subscribe', newsletterValidator, async (req, res, next) => {
  try {
    const { email } = req.body

    const existing = await Newsletter.findOne({ email })
    if (existing) {
      if (existing.active) {
        return res.status(400).json({ status: 'error', message: 'Email already subscribed' })
      }
      // Re-subscribe
      existing.active = true
      await existing.save()
      return res.json({ status: 'success', message: 'Successfully re-subscribed!' })
    }

    const unsubscribeToken = crypto.randomBytes(32).toString('hex')
    await Newsletter.create({ email, unsubscribeToken })

    // Send confirmation (non-blocking)
    sendEmail({
      to: email,
      subject: 'Subscribed to CyberGuard Security Updates',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;background:#0a1628;padding:32px;border-radius:12px;border:1px solid #1a3a5c;">
          <h2 style="color:#00d4ff;">You're subscribed! ⚡</h2>
          <p style="color:#94a3b8;">You'll receive the latest cybersecurity news, threat alerts, and tips from CyberGuard Solutions.</p>
          <p style="color:#64748b;font-size:12px;margin-top:24px;">
            <a href="${process.env.FRONTEND_URL}/unsubscribe/${unsubscribeToken}" style="color:#64748b;">Unsubscribe</a>
          </p>
        </div>
      `,
    }).catch(console.error)

    res.status(201).json({ status: 'success', message: 'Successfully subscribed!' })
  } catch (err) {
    next(err)
  }
})

// ── GET /api/newsletter/unsubscribe/:token ────────────
router.get('/unsubscribe/:token', async (req, res, next) => {
  try {
    const subscriber = await Newsletter.findOne({ unsubscribeToken: req.params.token })
    if (!subscriber) {
      return res.status(404).json({ status: 'error', message: 'Invalid unsubscribe link' })
    }
    subscriber.active = false
    await subscriber.save()
    res.json({ status: 'success', message: 'Successfully unsubscribed.' })
  } catch (err) {
    next(err)
  }
})

// ── GET /api/newsletter ───────────────────────────────
// Admin — list all subscribers
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { active } = req.query
    const filter = {}
    if (active !== undefined) filter.active = active === 'true'

    const subscribers = await Newsletter.find(filter).sort('-createdAt')
    res.json({ status: 'success', results: subscribers.length, data: subscribers })
  } catch (err) {
    next(err)
  }
})

export default router
