const express = require('express');
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const { protect, restrictTo } = require('../middleware/auth');
const { validateContact } = require('../middleware/validation');

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

// Public routes
router.post('/', contactValidation, validateContact, contactController.createContact);

// Protected routes (Admin only)
router.use(protect, restrictTo('admin', 'moderator'));

router.get('/', contactController.getAllContacts);
router.get('/stats/overview', contactController.getContactStats);
router.get('/:id', contactController.getContact);
router.patch('/:id', contactController.updateContact);

module.exports = router;