const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key')
    
    // Get admin info
    const admin = await Admin.findById(decoded.adminId).select('-password')

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      })
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      })
    }

    // Add admin to request object
    req.admin = admin
    next()

  } catch (error) {
    console.error('Auth middleware error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Authentication error.'
    })
  }
}

// Middleware to check for super admin role
const superAdminMiddleware = (req, res, next) => {
  if (req.admin.role !== 'super-admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super admin role required.'
    })
  }
  next()
}

module.exports = {
  authMiddleware,
  superAdminMiddleware
}
