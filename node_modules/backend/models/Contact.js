const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  projectType: {
    type: String,
    enum: [
      'Business Website',
      'E-commerce Platform', 
      'Web Application',
      'Portfolio Site',
      'Landing Page',
      'API Development',
      'Maintenance & Support',
      'Other'
    ]
  },
  budget: {
    type: String,
    enum: [
      '$2,000 - $5,000',
      '$5,000 - $10,000',
      '$10,000 - $25,000',
      '$25,000 - $50,000',
      '$50,000+'
    ]
  },
  timeline: {
    type: String,
    enum: [
      'ASAP',
      '1-2 weeks',
      '1 month',
      '2-3 months',
      '3+ months',
      'Just exploring'
    ]
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'converted', 'closed'],
    default: 'new'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
})

// Indexes for better query performance
contactSchema.index({ email: 1 })
contactSchema.index({ createdAt: -1 })
contactSchema.index({ status: 1 })

// Virtual for full contact info
contactSchema.virtual('fullContactInfo').get(function() {
  return {
    name: this.name,
    email: this.email,
    company: this.company || 'Not specified'
  }
})

// Method to mark as contacted
contactSchema.methods.markAsContacted = function() {
  this.status = 'contacted'
  return this.save()
}

module.exports = mongoose.model('Contact', contactSchema)
