import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Protect routes — require valid JWT
export const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies?.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized. Please log in.',
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists.',
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token.',
    })
  }
}

// Authorize by role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Role '${req.user.role}' is not authorized to access this route.`,
      })
    }
    next()
  }
}

// Optional auth — attach user if token present, but don't block
export const optionalAuth = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id)
    }
  } catch (_) {
    // ignore — optional
  }
  next()
}
