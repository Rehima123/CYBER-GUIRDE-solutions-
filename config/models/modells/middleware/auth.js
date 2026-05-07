const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// Protect routes - JWT authentication
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1) Check if token exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id).select('+password');
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'error',
        message: 'User recently changed password. Please log in again.'
      });
    }

    // 5) Check if account is locked
    if (currentUser.isLocked) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is temporarily locked due to too many login attempts.'
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    
    // Log the access
    await AuditLog.create({
      action: 'API_ACCESS',
      user: currentUser._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      metadata: {
        route: req.originalUrl,
        method: req.method
      }
    });

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again.'
    });
  }
};

// Grant access to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};

// Optional authentication (doesn't throw error if no user)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (token) {
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      
      if (currentUser && !currentUser.changedPasswordAfter(decoded.iat) && !currentUser.isLocked) {
        req.user = currentUser;
      }
    }

    next();
  } catch (error) {
    next();
  }
};