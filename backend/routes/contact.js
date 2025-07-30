const express = require('express')
const rateLimit = require('express-rate-limit')
const Joi = require('joi')
const Contact = require('../models/Contact')
const emailService = require('../services/emailService')

const router = express.Router()

// Rate limiting for contact form (stricter)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again in 15 minutes.'
  }
})

// Validation schema
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().trim(),
  email: Joi.string().email().required().trim().lowercase(),
  company: Joi.string().max(100).trim().allow(''),
  projectType: Joi.string().valid(
    'Business Website',
    'E-commerce Platform',
    'Web Application',
    'Portfolio Site',
    'Landing Page',
    'API Development',
    'Maintenance & Support',
    'Other'
  ).allow(''),
  budget: Joi.string().valid(
    '$2,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000+'
  ).allow(''),
  timeline: Joi.string().valid(
    'ASAP',
    '1-2 weeks',
    '1 month',
    '2-3 months',
    '3+ months',
    'Just exploring'
  ).allow(''),
  message: Joi.string().min(10).max(2000).required().trim()
})

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', contactLimiter, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = contactSchema.validate(req.body)
    
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

    // Check for duplicate submissions (same email within last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const existingContact = await Contact.findOne({
      email: value.email,
      createdAt: { $gte: oneHourAgo }
    })

    if (existingContact) {
      return res.status(429).json({
        success: false,
        message: 'You have already submitted a contact form recently. Please wait before submitting again.'
      })
    }

    // Add metadata
    const contactData = {
      ...value,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    }

    // Save to database
    const contact = new Contact(contactData)
    await contact.save()

    // Send emails (don't wait for completion to avoid timeouts)
    Promise.all([
      emailService.sendContactNotification(contactData),
      emailService.sendContactConfirmation(value.email, value.name)
    ]).catch(emailError => {
      console.error('Email sending error:', emailError)
      // Log email errors but don't fail the request
    })

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      data: {
        id: contact._id,
        submittedAt: contact.createdAt
      }
    })

  } catch (error) {
    console.error('Contact form error:', error)
    
    // Don't expose internal errors to client
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    })
  }
})

// @route   GET /api/contact
// @desc    Get all contacts (admin only)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const status = req.query.status
    const skip = (page - 1) * limit

    // Build query
    const query = {}
    if (status) {
      query.status = status
    }

    // Get contacts with pagination
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-ipAddress -userAgent') // Hide sensitive data

    // Get total count
    const total = await Contact.countDocuments(query)

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get contacts error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts'
    })
  }
})

// @route   PUT /api/contact/:id/status
// @desc    Update contact status (admin only)
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(notes && { notes })
      },
      { new: true, runValidators: true }
    )

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    res.json({
      success: true,
      data: contact
    })

  } catch (error) {
    console.error('Update contact status error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating contact status'
    })
  }
})

// @route   GET /api/contact/stats
// @desc    Get contact statistics (admin only)
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const totalContacts = await Contact.countDocuments()
    const thisMonth = await Contact.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    })

    res.json({
      success: true,
      data: {
        total: totalContacts,
        thisMonth,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count
          return acc
        }, {})
      }
    })

  } catch (error) {
    console.error('Get contact stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching contact statistics'
    })
  }
})

module.exports = router
