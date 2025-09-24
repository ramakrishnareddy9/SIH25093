const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { USER_ROLES } = require('../config/constants');
const logger = require('../utils/logger');

// Password strength requirements
const PASSWORD_STRENGTH = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { 
    type: String, 
    enum: ['academic', 'extracurricular', 'leadership', 'community_service', 'internship', 'certification', 'competition', 'research', 'workshop', 'conference', 'other'],
    required: true 
  },
  date: { type: Date, default: Date.now },
  evidence: { type: String }, // URL to uploaded evidence
  verified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  skills: [{ type: String }], // Skills demonstrated
  organization: { type: String },
  hours: { type: Number }, // For activities with duration
  points: { type: Number }, // For credit system
  isExternal: { type: Boolean, default: false }, // If achievement is from external source
  externalId: { type: String } // ID from external system if applicable
}, { timestamps: true });

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  description: { type: String },
  activities: { type: String },
  gpa: { type: Number },
  maxGpa: { type: Number, default: 4.0 }
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  skills: [{ type: String }],
  teamMembers: [{
    name: String,
    role: String
  }],
  outcomes: { type: String },
  link: { type: String },
  evidence: { type: String } // URL to project files or demo
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    index: true
  },
  password: {
    type: String,
    required: function() { return this.authProvider === 'email'; },
    minlength: [PASSWORD_STRENGTH.minLength, `Password must be at least ${PASSWORD_STRENGTH.minLength} characters`],
    select: false
  },
  refreshToken: {
    type: String,
    select: false
  },
  passwordChangedAt: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
    select: false
  },
  lockUntil: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date,
    select: false
  },
  lastActive: {
    type: Date,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin', 'alumni'],
    default: 'student'
  },
  department: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Contact Information
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  
  // Profile Information
  photoURL: {
    type: String,
    default: '/default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  
  // Academic Information
  enrollmentDate: {
    type: Date
  },
  graduationDate: {
    type: Date
  },
  program: {
    type: String
  },
  specialization: {
    type: String
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10
  },
  
  // Authentication
  authProvider: {
    type: String,
    enum: ['email', 'google', 'microsoft', 'institution'],
    default: 'email'
  },
  firebaseUid: {
    type: String,
    sparse: true
  },
  
  // Social and Professional Links
  social: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    github: { type: String, trim: true },
    portfolio: { type: String, trim: true }
  },
  
  // Achievements and Activities
  achievements: [achievementSchema],
  education: [educationSchema],
  projects: [projectSchema],
  skills: [{
    name: { type: String, required: true },
    level: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    category: { 
      type: String,
      enum: ['technical', 'soft', 'language', 'other']
    },
    verified: { type: Boolean, default: false }
  }],
  
  // Enrollment and Progress
  enrolledCourses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['enrolled', 'in_progress', 'completed', 'dropped'],
      default: 'enrolled'
    },
    grade: {
      type: String
    },
    completedLessons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    }],
    completedModules: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    }],
    quizResults: [{
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
      },
      score: {
        type: Number,
        required: true
      },
      totalQuestions: {
        type: Number,
        required: true
      },
      timeTaken: Number, // in seconds
      completedAt: {
        type: Date,
        default: Date.now
      },
      responses: [{
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOption: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        points: Number
      }]
    }]
  }],
  
  // Certifications and Badges
  certificates: [{
    title: { type: String, required: true },
    issuingOrganization: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String,
    skills: [{ type: String }],
    verification: {
      verified: { type: Boolean, default: false },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      verifiedAt: Date
    }
  }],
  
  // Extracurricular Activities
  extracurriculars: [{
    activityType: {
      type: String,
      enum: ['club', 'sports', 'volunteer', 'competition', 'event', 'other'],
      required: true
    },
    title: { type: String, required: true },
    organization: String,
    role: String,
    description: String,
    startDate: Date,
    endDate: Date,
    isCurrent: { type: Boolean, default: false },
    skills: [{ type: String }],
    evidence: String, // URL to evidence
    verification: {
      verified: { type: Boolean, default: false },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      verifiedAt: Date
    }
  }],
  
  // Internships and Work Experience
  workExperience: [{
    company: { type: String, required: true },
    position: { type: String, required: true },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
      required: true
    },
    location: String,
    description: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    isCurrent: { type: Boolean, default: false },
    skills: [{ type: String }],
    supervisor: {
      name: String,
      email: String,
      phone: String
    },
    verification: {
      verified: { type: Boolean, default: false },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      verifiedAt: Date
    }
  }],
  
  // Research and Publications
  publications: [{
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['journal', 'conference', 'book', 'thesis', 'patent', 'other']
    },
    authors: [{ 
      name: String,
      isPrimary: { type: Boolean, default: false }
    }],
    publisher: String,
    publicationDate: Date,
    doi: String,
    url: String,
    description: String,
    verification: {
      verified: { type: Boolean, default: false },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      verifiedAt: Date
    }
  }],
  
  // Settings and Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      courses: { type: Boolean, default: true },
      messages: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'institution', 'connections', 'private'],
        default: 'institution'
      },
      contactVisibility: {
        type: String,
        enum: ['public', 'institution', 'connections', 'private'],
        default: 'connections'
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    darkMode: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  
  // System Fields
  lastLogin: Date,
  lastActive: Date,
  metadata: mongoose.Schema.Types.Mixed,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for full name
UserSchema.virtual('fullName').get(function() {
  return this.name;
});

// Add method to get user's achievements by category
UserSchema.methods.getAchievementsByCategory = function(category) {
  return this.achievements.filter(achievement => achievement.category === category);
};

// Add method to get user's skill levels
UserSchema.methods.getSkillLevels = function() {
  return this.skills.reduce((acc, skill) => {
    acc[skill.level] = (acc[skill.level] || 0) + 1;
    return acc;
  }, {});
};

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) {
    this.lastActive = new Date();
    return next();
  }

  try {
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    
    // Update passwordChangedAt
    this.passwordChangedAt = Date.now() - 1000; // Ensure token is created after password change
    
    // Update lastActive
    this.lastActive = new Date();
    
    next();
  } catch (error) {
    logger.error('Error hashing password:', error);
    next(error);
  }
});

// Create text index for search
UserSchema.index({
  name: 'text',
  email: 'text',
  'education.institution': 'text',
  'workExperience.company': 'text',
  'workExperience.position': 'text',
  'skills.name': 'text'
});
// Create compound indexes for frequently queried fields
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ department: 1, role: 1 });

// Instance method to check if password is correct
UserSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password was changed after token was issued
UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to create password reset token
UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Instance method to check if account is locked
UserSchema.methods.isAccountLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Static method to find user by credentials
UserSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password +failedLoginAttempts +lockUntil');
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Check if account is locked
  if (user.isAccountLocked()) {
    throw new Error('Account is temporarily locked. Please try again later.');
  }
  
  // Check if password is correct
  const isMatch = await user.correctPassword(password, user.password);
  
  if (!isMatch) {
    // Increment failed login attempts
    user.failedLoginAttempts += 1;
    
    // Lock account after 5 failed attempts for 30 minutes
    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
    }
    
    await user.save({ validateBeforeSave: false });
    throw new Error('Invalid email or password');
  }
  
  // Reset failed login attempts on successful login
  if (user.failedLoginAttempts > 0) {
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save({ validateBeforeSave: false });
  }
  
  return user;
};

// Add text index for search
UserSchema.index(
  { 
    name: 'text', 
    email: 'text',
    'education.institution': 'text',
    'workExperience.company': 'text'
  },
  {
    weights: {
      name: 5,
      email: 10,
      'education.institution': 3,
      'workExperience.company': 2
    },
    name: 'user_search_index'
  }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
