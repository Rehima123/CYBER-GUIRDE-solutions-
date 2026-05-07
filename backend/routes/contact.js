import express from 'express'
import Contact from '../models/Contact.js'
import { sendEmail } from '../utils/email.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, company, service, message } = req.body

    const contact = await Contact.create({
      name,
      email,
      company,
      service,
      message
    })

    // Send email notification
    try {
      await sendEmail({
        to: process.env.EMAIL_FROM,
        subject: 'New Contact Form Submission',
        html: `
          <h2>New Contact Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <p><strong>Service:</strong> ${service || 'N/A'}</p>
          <p><strong>Message:</strong> ${message}</p>
        `
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
    }

    res.status(201).json({
      status: 'success',
      message: 'Contact form submitted successfully',
      data: contact
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
})

export default router
