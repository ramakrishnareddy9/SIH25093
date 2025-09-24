const mongoose = require('mongoose');
const validator = require('validator');

const AchievementSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  
  // Categorization
  type: {
    type: String,
    required: [true, 'Achievement type is required'],
    enum: [
      'academic', 'sports', 'arts', 'leadership', 'community_service',
      'research', 'entrepreneurship', 'competition', 'certification', 'other'
    ]
  },
  
  category: {
    type: String,
    enum: ['individual', 'team', 'group'],
    default: 'individual'
  },
  
  // Achievement Details
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  
  // Date Information
  dateAwarded: {
    type: Date,
    required: [true, 'Award date is required'],
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Award date cannot be in the future'
    }
  },
  
  // Student Information
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  
  // Evidence and Verification
  evidenceFiles: [{
    url: {
      type: String,
      required: [true, 'File URL is required'],
      validate: [validator.isURL, 'Please provide a valid URL']
    },
    fileType: {
      type: String,
      enum: ['image', 'pdf', 'video', 'document', 'other'],
      required: true
    },
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Verification Status
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  
  // Approval Information
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  approvedAt: Date,
  
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason cannot be more than 500 characters']
  },
  
  // Additional Metadata
  skillsGained: [{
    type: String,
    trim: true
  }],
  
  externalReference: {
    type: String,
    trim: true,
    validate: [validator.isURL, 'Please provide a valid URL']
  },
  
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // System Fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
AchievementSchema.index({ student: 1, status: 1 });
AchievementSchema.index({ type: 1, status: 1 });
AchievementSchema.index({ dateAwarded: -1 });
AchievementSchema.index({ student: 1, type: 1, dateAwarded: -1 });

// Virtual for achievement duration (if applicable)
AchievementSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    return (this.endDate - this.startDate) / (1000 * 60 * 60 * 24); // in days
  }
  return null;
});

// Pre-save hook to update timestamps
AchievementSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get achievement statistics
AchievementSchema.statics.getStats = async function(studentId) {
  const stats = await this.aggregate([
    {
      $match: { student: studentId }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        approved: { 
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } 
        },
        pending: { 
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } 
        }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  return stats;
};

// Instance method to format achievement for display
AchievementSchema.methods.toJSON = function() {
  const achievement = this.toObject();
  achievement.id = achievement._id;
  
  // Remove sensitive/irrelevant data
  delete achievement._id;
  delete achievement.__v;
  
  return achievement;
};

// Text search index for full-text search
AchievementSchema.index({
  title: 'text',
  description: 'text',
  'skillsGained': 'text'
});

module.exports = mongoose.model('Achievement', AchievementSchema);
