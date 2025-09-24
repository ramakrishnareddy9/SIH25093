const Achievement = require('../models/achievement');
const User = require('../models/User');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Types: { ObjectId } } = require('mongoose');

/**
 * @desc    Create a new achievement
 * @route   POST /api/achievements
 * @access  Private/Student
 */
exports.createAchievement = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const studentId = req.user.id;
    const {
      title,
      type,
      description,
      category = 'individual',
      dateAwarded,
      skillsGained = [],
      externalReference,
      isPublic = false
    } = req.body;

    // Process uploaded files
    const evidenceFiles = req.files ? req.files.map(file => ({
      url: file.path,
      fileType: file.mimetype.split('/')[0] || 'other',
      originalName: file.originalname
    })) : [];

    const achievement = new Achievement({
      title,
      type,
      category,
      description,
      dateAwarded: dateAwarded || new Date(),
      student: studentId,
      evidenceFiles,
      skillsGained: Array.isArray(skillsGained) ? skillsGained : [skillsGained],
      externalReference,
      isPublic,
      status: 'pending'
    });

    await achievement.save();
    await achievement.populate('student', 'name email avatar');
    logger.info(`Achievement created: ${achievement._id} by student ${studentId}`);
    
    res.status(201).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    logger.error(`Error creating achievement: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Get all achievements with filtering, sorting, and pagination
 * @route   GET /api/achievements
 * @access  Private
 */
exports.getAchievements = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-dateAwarded',
      status,
      type,
      category,
      student,
      isPublic,
      search
    } = req.query;

    // Build query
    const query = {};
    
    // Role-based access control
    if (req.user.role === 'student') {
      query.student = req.user.id;
    } else if (req.user.role === 'teacher' || req.user.role === 'admin') {
      if (student && ObjectId.isValid(student)) {
        query.student = student;
      }
    }

    // Apply filters
    if (status) query.status = status;
    if (type) query.type = type;
    if (category) query.category = category;
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const achievements = await Achievement.find(query)
      .populate('student', 'name email avatar')
      .populate('approvedBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Achievement.countDocuments(query);

    res.status(200).json({
      success: true,
      count: achievements.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: achievements
    });
  } catch (error) {
    logger.error(`Error fetching achievements: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Get a single achievement by ID
 * @route   GET /api/achievements/:id
 * @access  Private
 */
exports.getAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
      .populate('student', 'name email avatar')
      .populate('approvedBy', 'name email');

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    // Check permissions
    if (req.user.role === 'student' && achievement.student._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid achievement ID'
      });
    }
    logger.error(`Error fetching achievement: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Update an achievement
 * @route   PUT /api/achievements/:id
 * @access  Private
 */
exports.updateAchievement = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    // Check permissions
    if (req.user.role === 'student' && achievement.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this achievement'
      });
    }

    // Prevent updating certain fields directly
    const { status, approvedBy, approvedAt, rejectionReason, ...updateData } = req.body;
    
    // Only allow status updates for teachers/admins
    if (['teacher', 'admin'].includes(req.user.role) && status) {
      updateData.status = status;
      if (status === 'approved') {
        updateData.approvedBy = req.user.id;
        updateData.approvedAt = new Date();
      } else if (status === 'rejected') {
        updateData.rejectionReason = req.body.rejectionReason || 'No reason provided';
      }
    }

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map(file => ({
        url: file.path,
        fileType: file.mimetype.split('/')[0] || 'other',
        originalName: file.originalname,
        uploadedAt: new Date()
      }));
      updateData.$push = { evidenceFiles: { $each: newFiles } };
    }

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('student', 'name email avatar')
     .populate('approvedBy', 'name email');

    logger.info(`Achievement updated: ${updatedAchievement._id} by user ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: updatedAchievement
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid achievement ID'
      });
    }
    logger.error(`Error updating achievement: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Delete an achievement
 * @route   DELETE /api/achievements/:id
 * @access  Private
 */
exports.deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    // Check permissions
    if (req.user.role === 'student' && achievement.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this achievement'
      });
    }

    await achievement.remove();
    logger.info(`Achievement deleted: ${req.params.id} by user ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid achievement ID'
      });
    }
    logger.error(`Error deleting achievement: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Get achievement statistics for a student
 * @route   GET /api/achievements/stats/student/:studentId?
 * @access  Private
 */
exports.getStudentAchievementStats = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user.id;
    
    // Check permissions
    if (req.user.role === 'student' && studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view these statistics'
      });
    }

    const stats = await Achievement.aggregate([
      { $match: { student: new ObjectId(studentId) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Calculate totals
    const totals = stats.reduce((acc, curr) => ({
      total: acc.total + curr.total,
      approved: acc.approved + curr.approved,
      pending: acc.pending + curr.pending,
      rejected: acc.rejected + curr.rejected
    }), { total: 0, approved: 0, pending: 0, rejected: 0 });

    res.status(200).json({
      success: true,
      data: {
        byType: stats,
        totals
      }
    });
  } catch (error) {
    logger.error(`Error fetching achievement stats: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Get pending achievements (for teachers/admins)
 * @route   GET /api/achievements/pending
 * @access  Private/Teacher,Admin
 */
exports.getPendingAchievements = async (req, res, next) => {
  try {
    if (!['teacher', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view pending achievements'
      });
    }

    const { page = 1, limit = 10 } = req.query;

    const achievements = await Achievement.find({ status: 'pending' })
      .populate('student', 'name email avatar')
      .sort({ createdAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Achievement.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      count: achievements.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: achievements
    });
  } catch (error) {
    logger.error(`Error fetching pending achievements: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Approve an achievement (for teachers/admins)
 * @route   PATCH /api/achievements/:id/approve
 * @access  Private/Teacher,Admin
 */
exports.approveAchievement = async (req, res, next) => {
  try {
    if (!['teacher', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to approve achievements'
      });
    }

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: new Date(),
        rejectionReason: undefined
      },
      { new: true, runValidators: true }
    )
    .populate('student', 'name email')
    .populate('approvedBy', 'name email');

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    logger.info(`Achievement approved: ${achievement._id} by user ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid achievement ID'
      });
    }
    logger.error(`Error approving achievement: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Reject an achievement (for teachers/admins)
 * @route   PATCH /api/achievements/:id/reject
 * @access  Private/Teacher,Admin
 */
exports.rejectAchievement = async (req, res, next) => {
  try {
    if (!['teacher', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to reject achievements'
      });
    }

    const { reason } = req.body;
    
    if (!reason || typeof reason !== 'string' || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid rejection reason (min 10 characters)'
      });
    }

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        approvedBy: req.user.id,
        approvedAt: new Date(),
        rejectionReason: reason.trim()
      },
      { new: true, runValidators: true }
    )
    .populate('student', 'name email')
    .populate('approvedBy', 'name email');

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    logger.info(`Achievement rejected: ${achievement._id} by user ${req.user.id}`);

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid achievement ID'
      });
    }
    logger.error(`Error rejecting achievement: ${error.message}`, { error });
    next(error);
  }
};

/**
 * @desc    Toggle achievement public/private status
 * @route   PATCH /api/achievements/:id/toggle-visibility
 * @access  Private/Student
 */
exports.toggleAchievementVisibility = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    // Check ownership
    if (achievement.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this achievement'
      });
    }

    // Toggle the isPublic status
    achievement.isPublic = !achievement.isPublic;
    await achievement.save();

    logger.info(`Toggled visibility for achievement ${achievement._id} to ${achievement.isPublic ? 'public' : 'private'}`);

    res.status(200).json({
      success: true,
      data: {
        _id: achievement._id,
        isPublic: achievement.isPublic
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid achievement ID'
      });
    }
    logger.error(`Error toggling achievement visibility: ${error.message}`, { error });
    next(error);
  }
};
