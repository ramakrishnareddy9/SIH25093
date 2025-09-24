const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  fieldOfStudy: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: false
  },
  gpa: Number,
  description: String,
  isCurrent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
educationSchema.index({ studentId: 1 });
educationSchema.index({ institution: 1 });

// Add pre-save hook to update timestamps
educationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Education = mongoose.model('Education', educationSchema);

module.exports = Education;
