const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email'
    }
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(phone) {
        return !phone || /^[\+]?[1-9][\d]{0,15}$/.test(phone);
      },
      message: 'Please provide a valid phone number'
    }
  },
  service: {
    type: String,
    enum: [
      'network', 
      'cloud', 
      'endpoint', 
      'data', 
      'monitoring', 
      'incident',
      'consulting',
      'other'
    ],
    default: 'other'
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    trim: true,
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'resolved', 'spam'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'other'],
    default: 'website'
  },
  ipAddress: String,
  userAgent: String,
  location: {
    country: String,
    city: String,
    region: String
  },
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  followUpDate: Date,
  tags: [String]
}, {
  timestamps: true
});

// Indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ service: 1 });

// Static method to get contact stats
contactSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Instance method to add note
contactSchema.methods.addNote = function(content, userId) {
  this.notes.push({
    content,
    createdBy: userId
  });
  return this.save();
};

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;