const { body, param, query } = require('express-validator');
const { validationResult } = require('express-validator');
const { Types: { ObjectId } } = require('mongoose');

// Common validation error formatter
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Validation for creating an achievement
const validateCreateAchievement = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
  
  body('type')
    .isIn([
      'academic', 'sports', 'arts', 'leadership', 'community_service',
      'research', 'entrepreneurship', 'competition', 'certification', 'other'
    ]).withMessage('Invalid achievement type'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot be more than 2000 characters'),
  
  body('category')
    .optional()
    .isIn(['individual', 'team', 'group']).withMessage('Invalid category'),
  
  body('dateAwarded')
    .optional()
    .isISO8601().withMessage('Invalid date format. Use ISO 8601 format (e.g., YYYY-MM-DD)')
    .toDate(),
  
  body('skillsGained')
    .optional()
    .isArray().withMessage('Skills must be an array')
    .custom((skills) => {
      if (!Array.isArray(skills)) return true;
      return skills.every(skill => typeof skill === 'string' && skill.trim().length > 0);
    }).withMessage('Each skill must be a non-empty string'),
  
  body('externalReference')
    .optional()
    .isURL().withMessage('External reference must be a valid URL'),
  
  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean')
    .toBoolean(),
  
  handleValidationErrors
];

// Validation for updating an achievement
const validateUpdateAchievement = [
  param('id')
    .notEmpty().withMessage('Achievement ID is required')
    .custom((value) => ObjectId.isValid(value)).withMessage('Invalid achievement ID'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
  
  body('type')
    .optional()
    .isIn([
      'academic', 'sports', 'arts', 'leadership', 'community_service',
      'research', 'entrepreneurship', 'competition', 'certification', 'other'
    ]).withMessage('Invalid achievement type'),
  
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty')
    .isLength({ max: 2000 }).withMessage('Description cannot be more than 2000 characters'),
  
  body('category')
    .optional()
    .isIn(['individual', 'team', 'group']).withMessage('Invalid category'),
  
  body('dateAwarded')
    .optional()
    .isISO8601().withMessage('Invalid date format. Use ISO 8601 format (e.g., YYYY-MM-DD)')
    .toDate(),
  
  body('skillsGained')
    .optional()
    .isArray().withMessage('Skills must be an array')
    .custom((skills) => {
      if (!Array.isArray(skills)) return true;
      return skills.every(skill => typeof skill === 'string' && skill.trim().length > 0);
    }).withMessage('Each skill must be a non-empty string'),
  
  body('externalReference')
    .optional()
    .isURL().withMessage('External reference must be a valid URL'),
  
  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean')
    .toBoolean(),
  
  handleValidationErrors
];

// Validation for achievement ID parameter
const validateAchievementId = [
  param('id')
    .notEmpty().withMessage('Achievement ID is required')
    .custom((value) => ObjectId.isValid(value)).withMessage('Invalid achievement ID'),
  
  handleValidationErrors
];

// Validation for achievement approval/rejection
const validateApproval = [
  param('id')
    .notEmpty().withMessage('Achievement ID is required')
    .custom((value) => ObjectId.isValid(value)).withMessage('Invalid achievement ID'),
  
  handleValidationErrors
];

// Validation for achievement rejection reason
const validateRejectionReason = [
  body('reason')
    .trim()
    .notEmpty().withMessage('Rejection reason is required')
    .isLength({ min: 10 }).withMessage('Rejection reason must be at least 10 characters long'),
  
  handleValidationErrors
];

// Validation for query parameters (pagination, filtering, sorting)
const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  query('sort')
    .optional()
    .matches(/^[-\w,]+$/).withMessage('Invalid sort parameter format'),
  
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status value'),
  
  query('type')
    .optional()
    .isIn([
      'academic', 'sports', 'arts', 'leadership', 'community_service',
      'research', 'entrepreneurship', 'competition', 'certification', 'other'
    ]).withMessage('Invalid achievement type'),
  
  query('category')
    .optional()
    .isIn(['individual', 'team', 'group']).withMessage('Invalid category'),
  
  query('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean')
    .toBoolean(),
  
  query('student')
    .optional()
    .custom((value) => ObjectId.isValid(value)).withMessage('Invalid student ID'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateAchievement,
  validateUpdateAchievement,
  validateAchievementId,
  validateApproval,
  validateRejectionReason,
  validateQueryParams,
  handleValidationErrors
};
