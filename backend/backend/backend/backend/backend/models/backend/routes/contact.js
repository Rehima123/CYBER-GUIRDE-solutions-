const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

const router = express.Router();

// Validation rules
const contactValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('company')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Company name cannot exceed 100 characters'),
    body('phone')
        .optional()
        .trim()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please provide a valid phone number'),
    body('service')
        .isIn(['network', 'cloud', 'endpoint', 'data', 'monitoring', 'incident', 'consulting', 'other'])
        .withMessage('Please select a valid service'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message must be between 10 and 2000 characters')
];

// @desc    Create new contact form submission
// @route   POST /api/contact
// @access  Public
router.post('/', contactValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, company, phone, service, message } = req.body;

        // Create contact
        const contact = await Contact.create({
            name,
            email,
            company,
            phone,
            service,
            message
        });

        // In a real application, you would send emails here
        console.log('New contact submission:', {
            name,
            email,
            company,
            service
        });

        res.status(201).json({
            status: 'success',
            message: 'Thank you for your message! We will contact you soon.',
            data: {
                contact: {
                    id: contact._id,
                    name: contact.name,
                    email: contact.email,
                    service: contact.service
                }
            }
        });

    } catch (error) {
        console.error('Contact creation error:', error);
        
        // MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'A contact with this email already exists'
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Failed to process your request. Please try again.'
        });
    }
});

// @desc    Get all contact submissions (for admin)
// @route   GET /api/contact
// @access  Private (add authentication later)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort('-createdAt');
        
        res.status(200).json({
            status: 'success',
            results: contacts.length,
            data: { contacts }
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch contacts'
        });
    }
});

module.exports = router;