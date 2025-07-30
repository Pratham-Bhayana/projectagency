const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true
})

// Indexes
adminSchema.index({ email: 1 })
adminSchema.index({ username: 1 })

// Virtual for account lock status
adminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

// Pre-save middleware to hash password
adminSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.isLocked) {
    throw new Error('Account is temporarily locked')
  }
  
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    
    if (isMatch) {
      // Reset login attempts and lock if successful
      if (this.loginAttempts || this.lockUntil) {
        this.loginAttempts = 0
        this.lockUntil = undefined
        await this.save()
      }
      
      // Update last login
      this.lastLogin = new Date()
      await this.save()
      
      return true
    } else {
      // Increment login attempts
      this.loginAttempts += 1
      
      // Lock account after 5 failed attempts for 2 hours
      if (this.loginAttempts >= 5) {
        this.lockUntil = Date.now() + 2 * 60 * 60 * 1000 // 2 hours
      }
      
      await this.save()
      return false
    }
  } catch (error) {
    throw error
  }
}

// Method to unlock account
adminSchema.methods.unlock = function() {
  this.loginAttempts = 0
  this.lockUntil = undefined
  return this.save()
}

module.exports = mongoose.model('Admin', adminSchema)
