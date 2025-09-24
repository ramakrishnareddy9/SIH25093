const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, isFaculty } = require('../middleware/auth');
const { createSuccessResponse, createErrorResponse } = require('../utils/response');
const { studentValidation, handleValidationErrors } = require('../utils/validation');

// Get all activities
router.get('/', [authenticate, isFaculty], async (req, res) => {
  try {
    // In a real application, you would fetch from an Activity model
    // For now, generate mock activities based on students and courses
    const students = await User.find({ role: 'student' }).select('_id name');

    const activities = [];

    students.forEach((student, studentIndex) => {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - studentIndex * 5);

      // Generate 3-5 activities per student
      const activityCount = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < activityCount; i++) {
        const activityDate = new Date(baseDate);
        activityDate.setDate(activityDate.getDate() - i * 2);

        activities.push({
          id: activities.length + 1,
          studentId: student._id,
          studentName: student.name,
          title: [
            'Project Submission',
            'Weekly Quiz',
            'Lab Assignment',
            'Midterm Exam',
            'Group Presentation',
            'Code Review',
            'Research Paper',
            'Final Project'
          ][i % 8],
          type: [
            'assignment',
            'quiz',
            'lab',
            'exam',
            'presentation',
            'review',
            'research',
            'project'
          ][i % 8],
          date: activityDate.toISOString(),
          status: ['completed', 'pending', 'submitted', 'approved'][Math.floor(Math.random() * 4)],
          score: Math.floor(Math.random() * 40) + 60,
          maxScore: 100,
          credits: [2, 3, 5, 1, 4][Math.floor(Math.random() * 5)]
        });
      }
    });

    return res.status(200).json(createSuccessResponse({
      activities: activities.sort((a, b) => new Date(b.date) - new Date(a.date)),
      count: activities.length
    }, 'Activities retrieved successfully'));
  } catch (error) {
    console.error('Get activities error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve activities'));
  }
});

// Get activities by student ID
router.get('/student/:studentId', [authenticate], async (req, res) => {
  try {
    const { studentId } = req.params;

    // Verify the student exists
    const student = await User.findOne({
      _id: studentId,
      role: 'student'
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // In a real application, you would fetch from an Activity model
    // For now, generate mock activities for this student
    const activities = [];
    const baseDate = new Date();

    for (let i = 0; i < 8; i++) {
      const activityDate = new Date(baseDate);
      activityDate.setDate(activityDate.getDate() - i * 3);

      activities.push({
        id: activities.length + 1,
        studentId: student._id,
        studentName: student.name,
        title: [
          'Project Submission',
          'Weekly Quiz',
          'Lab Assignment',
          'Midterm Exam',
          'Group Presentation',
          'Code Review',
          'Research Paper',
          'Final Project'
        ][i % 8],
        type: [
          'assignment',
          'quiz',
          'lab',
          'exam',
          'presentation',
          'review',
          'research',
          'project'
        ][i % 8],
        date: activityDate.toISOString(),
        status: ['completed', 'pending', 'submitted', 'approved'][Math.floor(Math.random() * 4)],
        score: Math.floor(Math.random() * 40) + 60,
        maxScore: 100,
        credits: [2, 3, 5, 1, 4][Math.floor(Math.random() * 5)]
      });
    }

    return res.status(200).json(createSuccessResponse({
      activities: activities.sort((a, b) => new Date(b.date) - new Date(a.date)),
      count: activities.length
    }, 'Student activities retrieved successfully'));
  } catch (error) {
    console.error('Get student activities error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve student activities'));
  }
});

// Get activities by status
router.get('/status/:status', [authenticate, isFaculty], async (req, res) => {
  try {
    const { status } = req.params;

    if (!['completed', 'pending', 'submitted', 'approved'].includes(status)) {
      return res.status(400).json(createErrorResponse('Invalid status. Must be: completed, pending, submitted, or approved'));
    }

    const students = await User.find({ role: 'student' }).select('_id name');

    const activities = [];

    students.forEach((student) => {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - Math.random() * 30);

      const activityDate = new Date(baseDate);
      activities.push({
        id: activities.length + 1,
        studentId: student._id,
        studentName: student.name,
        title: 'Activity Review',
        type: 'review',
        date: activityDate.toISOString(),
        status: status,
        score: Math.floor(Math.random() * 30) + 70,
        maxScore: 100,
        credits: 3
      });
    });

    return res.status(200).json(createSuccessResponse({
      activities: activities.slice(0, 20), // Limit to 20 activities
      count: activities.length
    }, 'Activities retrieved successfully'));
  } catch (error) {
    console.error('Get activities by status error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve activities'));
  }
});

// Get activity statistics
router.get('/stats/overview', [authenticate, isFaculty], async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('_id name enrolledCourses');

    let totalActivities = 0;
    let completedActivities = 0;
    let pendingActivities = 0;
    let totalCredits = 0;

    const activityTypes = {
      assignment: 0,
      quiz: 0,
      lab: 0,
      exam: 0,
      presentation: 0,
      review: 0,
      research: 0,
      project: 0
    };

    students.forEach((student) => {
      const studentActivities = Math.floor(Math.random() * 10) + 5;
      totalActivities += studentActivities;

      const completed = Math.floor(studentActivities * 0.7);
      const pending = studentActivities - completed;

      completedActivities += completed;
      pendingActivities += pending;

      // Add to activity types
      const types = Object.keys(activityTypes);
      for (let i = 0; i < studentActivities; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        activityTypes[type]++;
      }

      totalCredits += student.completedCredits || Math.floor(Math.random() * 60) + 30;
    });

    return res.status(200).json(createSuccessResponse({
      stats: {
        totalActivities,
        completedActivities,
        pendingActivities,
        completionRate: Math.round((completedActivities / totalActivities) * 100),
        activityTypes: Object.entries(activityTypes).map(([type, count]) => ({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          count
        })),
        averageCredits: Math.round(totalCredits / students.length)
      }
    }, 'Activity statistics retrieved successfully'));
  } catch (error) {
    console.error('Get activity stats error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve activity statistics'));
  }
});

module.exports = router;
