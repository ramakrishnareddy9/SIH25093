const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, isAdmin, isFaculty } = require('../middleware/auth');
const { createSuccessResponse, createErrorResponse } = require('../utils/response');
const { studentValidation, handleValidationErrors } = require('../utils/validation');

// Get all students
router.get('/', [authenticate, isFaculty], async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('id name email studentId department yearOfStudy gpa attendance completedCredits totalCredits rollNumber')
      .sort({ name: 1 });

    return res.status(200).json(createSuccessResponse({
      students,
      count: students.length
    }, 'Students retrieved successfully'));
  } catch (error) {
    console.error('Get students error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve students'));
  }
});

// Get student by ID
router.get('/:id', [authenticate, ...studentValidation.getById], async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: 'student'
    }).select('id name email studentId department yearOfStudy gpa attendance completedCredits totalCredits rollNumber eventsAttended certificatesEarned');

    if (!student) {
      return res.status(404).json(createErrorResponse('Student not found'));
    }

    return res.status(200).json(createSuccessResponse({
      student
    }, 'Student retrieved successfully'));
  } catch (error) {
    console.error('Get student error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve student'));
  }
});

// Get student activities
router.get('/:id/activities', [authenticate, ...studentValidation.getById], async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: 'student'
    });

    if (!student) {
      return res.status(404).json(createErrorResponse('Student not found'));
    }

    // In a real application, you would fetch activities from an Activity model
    // For now, return mock data based on student's enrolled courses
    const activities = student.enrolledCourses.map((course, index) => ({
      id: index + 1,
      studentId: student._id,
      title: `Activity for ${course.courseName || 'Course'}`,
      type: index % 3 === 0 ? 'assignment' : index % 3 === 1 ? 'quiz' : 'project',
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: Math.random() > 0.3 ? 'completed' : 'pending',
      score: Math.floor(Math.random() * 40) + 60,
      maxScore: 100
    }));

    return res.status(200).json(createSuccessResponse({
      activities,
      count: activities.length
    }, 'Student activities retrieved successfully'));
  } catch (error) {
    console.error('Get student activities error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve student activities'));
  }
});

// Get student certificates
router.get('/:id/certificates', [authenticate, ...studentValidation.getById], async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: 'student'
    });

    if (!student) {
      return res.status(404).json(createErrorResponse('Student not found'));
    }

    return res.status(200).json(createSuccessResponse({
      certificates: student.certificates,
      count: student.certificates.length
    }, 'Student certificates retrieved successfully'));
  } catch (error) {
    console.error('Get student certificates error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve student certificates'));
  }
});

// Get student events
router.get('/:id/events', [authenticate, ...studentValidation.getById], async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: 'student'
    });

    if (!student) {
      return res.status(404).json(createErrorResponse('Student not found'));
    }

    // In a real application, you would fetch events from an Event model
    // For now, return mock events data
    const events = [
      {
        id: 1,
        title: "Tech Conference 2025",
        date: "2025-03-15",
        description: "Annual technology conference featuring latest trends in software development.",
        location: "Main Auditorium",
        organizer: "Computer Science Department"
      },
      {
        id: 2,
        title: "AI Workshop",
        date: "2025-04-20",
        description: "Hands-on workshop on artificial intelligence and machine learning.",
        location: "Lab 301",
        organizer: "AI Research Group"
      }
    ];

    return res.status(200).json(createSuccessResponse({
      events,
      count: events.length
    }, 'Student events retrieved successfully'));
  } catch (error) {
    console.error('Get student events error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve student events'));
  }
});

// Get student dashboard data
router.get('/:id/dashboard', [authenticate, ...studentValidation.getById], async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: 'student'
    });

    if (!student) {
      return res.status(404).json(createErrorResponse('Student not found'));
    }

    // Calculate dashboard statistics
    const totalActivities = student.enrolledCourses.length * 3; // Mock calculation
    const completedActivities = Math.floor(totalActivities * 0.7); // 70% completion rate
    const pendingActivities = totalActivities - completedActivities;
    const totalCredits = student.completedCredits || 60;
    const completedCredits = student.completedCredits || 45;

    return res.status(200).json(createSuccessResponse({
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        department: student.department,
        yearOfStudy: student.yearOfStudy,
        gpa: student.gpa || 3.6,
        attendance: student.attendance || 88,
        completedCredits: completedCredits,
        totalCredits: totalCredits,
        rollNumber: student.rollNumber || 'STU' + student._id.toString().slice(-4)
      },
      stats: {
        totalActivities,
        completedActivities,
        pendingActivities,
        totalCredits: completedCredits
      }
    }, 'Student dashboard retrieved successfully'));
  } catch (error) {
    console.error('Get student dashboard error:', error);
    return res.status(500).json(createErrorResponse('Failed to retrieve student dashboard'));
  }
});

module.exports = router;
