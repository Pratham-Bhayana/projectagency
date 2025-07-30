const express = require('express')
const Joi = require('joi')
const Project = require('../models/Project')

const router = express.Router()

// Validation schemas
const projectSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().trim(),
  description: Joi.string().min(10).max(500).required().trim(),
  longDescription: Joi.string().max(2000).trim().allow(''),
  category: Joi.string().valid('Full-Stack', 'Frontend', 'Backend', 'Mobile', 'Design').required(),
  technologies: Joi.array().items(Joi.string().trim()).min(1).required(),
  features: Joi.array().items(Joi.string().trim()).min(1).required(),
  images: Joi.array().items(Joi.object({
    url: Joi.string().uri().required(),
    alt: Joi.string().required(),
    isPrimary: Joi.boolean().default(false)
  })).min(1).required(),
  links: Joi.object({
    live: Joi.string().uri().allow(''),
    github: Joi.string().uri().allow(''),
    caseStudy: Joi.string().uri().allow('')
  }),
  client: Joi.object({
    name: Joi.string().allow(''),
    industry: Joi.string().allow(''),
    website: Joi.string().uri().allow('')
  }),
  metrics: Joi.object({
    duration: Joi.string().allow(''),
    teamSize: Joi.number().integer().min(1),
    impact: Joi.string().allow('')
  }),
  status: Joi.string().valid('active', 'completed', 'archived', 'draft').default('draft'),
  featured: Joi.boolean().default(false),
  order: Joi.number().integer().default(0)
})

// @route   GET /api/projects
// @desc    Get all public projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query
    
    // Build query for public projects only
    const query = { status: { $in: ['active', 'completed'] } }
    
    if (category && category !== 'All') {
      query.category = category
    }
    
    if (featured === 'true') {
      query.featured = true
    }

    const projects = await Project.find(query)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .select('-createdAt -updatedAt -__v')

    res.json({
      success: true,
      data: projects
    })

  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching projects'
    })
  }
})

// @route   GET /api/projects/categories
// @desc    Get all project categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Project.aggregate([
      {
        $match: { status: { $in: ['active', 'completed'] } }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])

    const totalProjects = await Project.countDocuments({
      status: { $in: ['active', 'completed'] }
    })

    // Add "All" category
    const result = [
      { _id: 'All', count: totalProjects },
      ...categories
    ]

    res.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    })
  }
})

// @route   GET /api/projects/featured
// @desc    Get featured projects
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.getFeatured()
      .select('-createdAt -updatedAt -__v')
      .limit(6) // Limit to 6 featured projects

    res.json({
      success: true,
      data: projects
    })

  } catch (error) {
    console.error('Get featured projects error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching featured projects'
    })
  }
})

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      status: { $in: ['active', 'completed'] }
    }).select('-createdAt -updatedAt -__v')

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    res.json({
      success: true,
      data: project
    })

  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching project'
    })
  }
})

// Admin routes (would need authentication middleware in production)

// @route   POST /api/projects
// @desc    Create new project (admin only)
// @access  Private
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = projectSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      })
    }

    // Ensure only one primary image
    const images = value.images
    const primaryImages = images.filter(img => img.isPrimary)
    
    if (primaryImages.length > 1) {
      return res.status(400).json({
        success: false,
        message: 'Only one image can be marked as primary'
      })
    }
    
    if (primaryImages.length === 0 && images.length > 0) {
      images[0].isPrimary = true
    }

    const project = new Project(value)
    await project.save()

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    })

  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating project'
    })
  }
})

// @route   PUT /api/projects/:id
// @desc    Update project (admin only)
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = projectSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      })
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    )

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    })

  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating project'
    })
  }
})

// @route   DELETE /api/projects/:id
// @desc    Delete project (admin only)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    })

  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting project'
    })
  }
})

// @route   GET /api/projects/admin/all
// @desc    Get all projects including drafts (admin only)
// @access  Private
router.get('/admin/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const status = req.query.status
    const category = req.query.category
    const skip = (page - 1) * limit

    // Build query
    const query = {}
    if (status) {
      query.status = status
    }
    if (category && category !== 'All') {
      query.category = category
    }

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Project.countDocuments(query)

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get admin projects error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching projects'
    })
  }
})

module.exports = router
