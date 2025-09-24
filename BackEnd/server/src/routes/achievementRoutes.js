const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { upload, uploadFiles, handleUploadError } = require('../middleware/upload');
const {
  createAchievement,
  getAchievements,
  getAchievement,
  updateAchievement,
  deleteAchievement,
  getStudentAchievementStats,
  getPendingAchievements,
  approveAchievement,
  rejectAchievement,
  toggleAchievementVisibility
} = require('../controllers/achievementController');

const {
  validateCreateAchievement,
  validateUpdateAchievement,
  validateAchievementId,
  validateApproval,
  validateRejectionReason,
  validateQueryParams
} = require('../middleware/validators/achievementValidator');

// Middleware to check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: 'Not authorized to access this route' 
      });
    }
    next();
  };
};

// File upload configuration is now handled in the upload middleware

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route   GET /api/achievements
 * @desc    Get all achievements with filtering, sorting, and pagination
 * @access  Private (Student can see their own, Teachers/Admins can see all with filters)
 */
router.get('/', validateQueryParams, getAchievements);

/**
 * @route   POST /api/achievements
 * @desc    Create a new achievement
 * @access  Private/Student
 */
router.post(
  '/',
  authorize('student'),
  uploadFiles,
  validateCreateAchievement,
  createAchievement
);

/**
 * @route   GET /api/achievements/stats/student/:studentId?
 * @desc    Get achievement statistics for a student
 * @access  Private (Student can see their own, Teachers/Admins can see any)
 */
router.get(
  '/stats/student/:studentId?',
  validateQueryParams,
  getStudentAchievementStats
);

/**
 * @route   GET /api/achievements/pending
 * @desc    Get pending achievements (for teachers/admins)
 * @access  Private/Teacher,Admin
 */
router.get(
  '/pending',
  authorize('teacher', 'admin'),
  validateQueryParams,
  getPendingAchievements
);

/**
 * @route   GET /api/achievements/:id
 * @desc    Get a single achievement by ID
 * @access  Private (Student can see their own, Teachers/Admins can see any)
 */
router.get(
  '/:id',
  validateAchievementId,
  getAchievement
);

/**
 * @route   PUT /api/achievements/:id
 * @desc    Update an achievement
 * @access  Private (Student can update their own, Teachers/Admins can update any)
 */
router.put(
  '/:id',
  uploadFiles,
  validateUpdateAchievement,
  updateAchievement
);

/**
 * @route   DELETE /api/achievements/:id
 * @desc    Delete an achievement
 * @access  Private (Student can delete their own, Teachers/Admins can delete any)
 */
router.delete(
  '/:id',
  validateAchievementId,
  deleteAchievement
);

/**
 * @route   PATCH /api/achievements/:id/approve
 * @desc    Approve an achievement (for teachers/admins)
 * @access  Private/Teacher,Admin
 */
router.patch(
  '/:id/approve',
  authorize('teacher', 'admin'),
  validateApproval,
  approveAchievement
);

/**
 * @route   PATCH /api/achievements/:id/reject
 * @desc    Reject an achievement (for teachers/admins)
 * @access  Private/Teacher,Admin
 */
router.patch(
  '/:id/reject',
  authorize('teacher', 'admin'),
  validateApproval,
  validateRejectionReason,
  rejectAchievement
);

/**
 * @route   PATCH /api/achievements/:id/toggle-visibility
 * @desc    Toggle achievement public/private status (for student owners)
 * @access  Private/Student
 */
router.patch(
  '/:id/toggle-visibility',
  authorize('student'),
  validateAchievementId,
  toggleAchievementVisibility
);

module.exports = router;
