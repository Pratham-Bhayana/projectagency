const express = require('express')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const Admin = require('../models/Admin')

const router = express.Router()

// Validation schemas
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().trim(),
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().min(6).required(),
  name: Joi.string().max(100).required().trim(),
  role: Joi.string().valid('admin', 'super-admin').default('admin')
})

// Generate JWT token
const generateToken = (adminId) => {
  return jwt.sign(
    { adminId },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: '7d' }
  )
}

// @route   POST /api/auth/register
// @desc    Register new admin (super-admin only in production)
// @access  Public (should be private in production)
router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = registerSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      })
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [
        { email: value.email },
        { username: value.username }
      ]
    })

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email or username already exists'
      })
    }

    // Create new admin
    const admin = new Admin(value)
    await admin.save()

    // Generate token
    const token = generateToken(admin._id)

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    })

  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      message: 'Error registering admin'
    })
  }
})

// @route   POST /api/auth/login
// @desc    Login admin
// @access  Public
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      })
    }

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [
        { username: value.username },
        { email: value.username }
      ]
    })

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      })
    }

    // Check if account is locked
    if (admin.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts'
      })
    }

    // Compare password
    const isMatch = await admin.comparePassword(value.password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Generate token
    const token = generateToken(admin._id)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    
    if (error.message === 'Account is temporarily locked') {
      return res.status(423).json({
        success: false,
        message: error.message
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Error during login'
    })
  }
})

// @route   POST /api/auth/logout
// @desc    Logout admin (client-side token removal)
// @access  Private
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  })
})

// @route   GET /api/auth/verify
// @desc    Verify JWT token and get admin info
// @access  Private
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key')
    
    // Get admin info
    const admin = await Admin.findById(decoded.adminId).select('-password')

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      })
    }

    res.json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      }
    })

  } catch (error) {
    console.error('Token verification error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Error verifying token'
    })
  }
})

// @route   PUT /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.put('/change-password', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key')
    
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      })
    }

    // Get admin
    const admin = await Admin.findById(decoded.adminId)

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      })
    }

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword)

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    admin.password = newPassword
    await admin.save()

    res.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    })
  }
})

module.exports = router
