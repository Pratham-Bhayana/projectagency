const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  longDescription: {
    type: String,
    maxlength: [2000, 'Long description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: ['Full-Stack', 'Frontend', 'Backend', 'Mobile', 'Design']
  },
  technologies: [{
    type: String,
    required: true,
    trim: true
  }],
  features: [{
    type: String,
    required: true,
    trim: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  links: {
    live: {
      type: String,
      match: [/^https?:\/\//, 'Please provide a valid URL']
    },
    github: {
      type: String,
      match: [/^https?:\/\//, 'Please provide a valid URL']
    },
    caseStudy: {
      type: String,
      match: [/^https?:\/\//, 'Please provide a valid URL']
    }
  },
  client: {
    name: String,
    industry: String,
    website: String
  },
  metrics: {
    duration: String, // e.g., "3 months"
    teamSize: Number,
    impact: String // e.g., "Increased sales by 300%"
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived', 'draft'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Indexes
projectSchema.index({ category: 1 })
projectSchema.index({ status: 1 })
projectSchema.index({ featured: -1, order: 1, createdAt: -1 })

// Virtual for primary image
projectSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary)
  return primary || this.images[0]
})

// Static method to get featured projects
projectSchema.statics.getFeatured = function() {
  return this.find({ featured: true, status: { $in: ['active', 'completed'] } })
    .sort({ order: 1, createdAt: -1 })
}

// Static method to get projects by category
projectSchema.statics.getByCategory = function(category) {
  const query = { status: { $in: ['active', 'completed'] } }
  if (category && category !== 'All') {
    query.category = category
  }
  return this.find(query).sort({ featured: -1, order: 1, createdAt: -1 })
}

module.exports = mongoose.model('Project', projectSchema)
