// utils/validation.js
const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      })),
      timestamp: new Date().toISOString()
    });
  }
  next();
};

// Student validation schemas
const studentValidation = {
  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid student ID format'),
    handleValidationErrors
  ],

  updateProfile: [
    param('id')
      .isMongoId()
      .withMessage('Invalid student ID format'),
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('department')
      .optional()
      .isIn(['Computer Science', 'Information Technology', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration', 'Arts', 'Science'])
      .withMessage('Invalid department'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    handleValidationErrors
  ]
};

// Activity validation schemas
const activityValidation = {
  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid activity ID format'),
    handleValidationErrors
  ],

  create: [
    body('title')
      .isLength({ min: 3, max: 200 })
      .withMessage('Activity title must be between 3 and 200 characters'),
    body('type')
      .isIn(['assignment', 'quiz', 'lab', 'exam', 'presentation', 'project', 'workshop', 'research'])
      .withMessage('Invalid activity type'),
    body('studentId')
      .isMongoId()
      .withMessage('Invalid student ID format'),
    body('score')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Score must be between 0 and 100'),
    body('maxScore')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Maximum score must be greater than 0'),
    handleValidationErrors
  ]
};

// Event validation schemas
const eventValidation = {
  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Event ID must be a positive integer'),
    handleValidationErrors
  ],

  register: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Event ID must be a positive integer'),
    handleValidationErrors
  ]
};

// Faculty validation schemas
const facultyValidation = {
  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid faculty ID format'),
    handleValidationErrors
  ],

  getByDepartment: [
    param('department')
      .isLength({ min: 2, max: 100 })
      .withMessage('Department name must be between 2 and 100 characters'),
    handleValidationErrors
  ]
};

// Analytics validation schemas
const analyticsValidation = {
  dateRange: [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid start date format'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid end date format'),
    handleValidationErrors
  ]
};

// Common validation schemas
const commonValidation = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
  ],

  search: [
    query('search')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),
    handleValidationErrors
  ]
};

module.exports = {
  handleValidationErrors,
  studentValidation,
  activityValidation,
  eventValidation,
  facultyValidation,
  analyticsValidation,
  commonValidation
};
