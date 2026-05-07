import { body, validationResult } from 'express-validator'

// Run validation and return errors
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: errors.array()[0].msg,
      errors: errors.array(),
    })
  }
  next()
}

// ── Auth validators ──────────────────────────────────
export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
  validate,
]

export const loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
]

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  validate,
]

export const resetPasswordValidator = [
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number'),
  validate,
]

// ── Contact validator ────────────────────────────────
export const contactValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
  validate,
]

// ── Newsletter validator ─────────────────────────────
export const newsletterValidator = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  validate,
]
