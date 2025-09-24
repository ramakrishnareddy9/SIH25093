const express = require('express');
const router = express.Router();
const { authenticate, isAdmin, isFaculty } = require('../middleware/auth');
const User = require('../models/User');

// Get analytics overview
router.get('/overview', [authenticate], async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    const faculty = await User.find({ role: 'faculty' });

    // Calculate student statistics
    const studentStats = {
      totalStudents: students.length,
      departments: {},
      yearDistribution: {},
      averageGPA: 0,
      averageAttendance: 0,
      totalCredits: 0
    };

    let totalGPA = 0;
    let totalAttendance = 0;
    let totalCredits = 0;

    students.forEach(student => {
      // Count by department
      studentStats.departments[student.department] = (studentStats.departments[student.department] || 0) + 1;

      // Count by year
      studentStats.yearDistribution[student.yearOfStudy] = (studentStats.yearDistribution[student.yearOfStudy] || 0) + 1;

      // Sum GPA and attendance
      if (student.gpa) totalGPA += student.gpa;
      if (student.attendance) totalAttendance += student.attendance;
      if (student.completedCredits) totalCredits += student.completedCredits;
    });

    studentStats.averageGPA = students.length > 0 ? Math.round((totalGPA / students.length) * 100) / 100 : 0;
    studentStats.averageAttendance = students.length > 0 ? Math.round(totalAttendance / students.length) : 0;

    // Generate activity statistics
    const activityStats = {
      totalActivities: Math.floor(students.length * 8), // Average 8 activities per student
      completedActivities: Math.floor(students.length * 8 * 0.7), // 70% completion rate
      pendingActivities: Math.floor(students.length * 8 * 0.3), // 30% pending
      averageScore: 82
    };

    // Generate certificate statistics
    let totalCertificates = 0;
    students.forEach(student => {
      totalCertificates += student.certificates ? student.certificates.length : 0;
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalStudents: students.length,
          totalFaculty: faculty.length,
          totalCourses: Math.floor(students.length / 15), // Estimate courses
          totalEvents: 5, // Mock data
          activeCertificates: totalCertificates,
          averageAttendance: studentStats.averageAttendance,
          overallPerformance: studentStats.averageGPA * 25 // Convert GPA to percentage
        },
        studentStats,
        activityStats,
        certificateStats: {
          totalCertificates,
          certificatesPerStudent: students.length > 0 ? Math.round(totalCertificates / students.length * 100) / 100 : 0
        }
      }
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get monthly statistics
router.get('/monthly-stats', [authenticate, isFaculty], async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Generate mock monthly data for the current year
    const monthlyStats = [
      { month: 'January', year: currentYear, newEnrollments: 45, eventsHeld: 3, certificatesIssued: 28, averageScore: 78.5 },
      { month: 'February', year: currentYear, newEnrollments: 52, eventsHeld: 4, certificatesIssued: 35, averageScore: 81.2 },
      { month: 'March', year: currentYear, newEnrollments: 38, eventsHeld: 2, certificatesIssued: 42, averageScore: 83.7 },
      { month: 'April', year: currentYear, newEnrollments: 61, eventsHeld: 5, certificatesIssued: 48, averageScore: 85.1 },
      { month: 'May', year: currentYear, newEnrollments: 55, eventsHeld: 3, certificatesIssued: 52, averageScore: 86.3 },
      { month: 'June', year: currentYear, newEnrollments: 42, eventsHeld: 4, certificatesIssued: 38, averageScore: 84.9 }
    ];

    res.status(200).json({
      success: true,
      data: {
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get monthly stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get department performance
router.get('/department-performance', [authenticate, isFaculty], async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });

    const departmentPerformance = {};
    const departments = {};

    students.forEach(student => {
      if (!departments[student.department]) {
        departments[student.department] = {
          students: 0,
          totalGPA: 0,
          totalAttendance: 0,
          totalCredits: 0
        };
      }

      departments[student.department].students += 1;
      if (student.gpa) departments[student.department].totalGPA += student.gpa;
      if (student.attendance) departments[student.department].totalAttendance += student.attendance;
      if (student.completedCredits) departments[student.department].totalCredits += student.completedCredits;
    });

    // Convert to array and calculate averages
    const performanceArray = Object.entries(departments).map(([department, stats]) => ({
      department,
      students: stats.students,
      averageGPA: stats.students > 0 ? Math.round((stats.totalGPA / stats.students) * 100) / 100 : 0,
      averageAttendance: stats.students > 0 ? Math.round(stats.totalAttendance / stats.students) : 0,
      completionRate: stats.students > 0 ? Math.round((stats.totalCredits / (stats.students * 60)) * 100) : 0
    })).sort((a, b) => b.students - a.students);

    res.status(200).json({
      success: true,
      data: {
        departmentPerformance: performanceArray
      }
    });
  } catch (error) {
    console.error('Get department performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get recent activities
router.get('/recent-activities', [authenticate, isFaculty], async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).limit(10);

    const recentActivities = [];

    students.forEach((student, index) => {
      const activityDate = new Date();
      activityDate.setDate(activityDate.getDate() - index);

      recentActivities.push({
        id: recentActivities.length + 1,
        type: ['enrollment', 'certificate', 'event', 'achievement', 'submission'][index % 5],
        description: `${student.name} ${['enrolled in a new course', 'earned a certificate', 'attended an event', 'achieved 100% in an exam', 'submitted a project'][index % 5]}`,
        timestamp: activityDate.toISOString(),
        user: student.name,
        userId: student._id
      });
    });

    res.status(200).json({
      success: true,
      data: {
        count: recentActivities.length,
        recentActivities: recentActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      }
    });
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get upcoming events
router.get('/upcoming-events', [authenticate], async (req, res) => {
  try {
    // Mock upcoming events
    const upcomingEvents = [
      {
        id: 1,
        title: "Annual Tech Conference",
        date: "2025-10-15",
        registrations: 145
      },
      {
        id: 2,
        title: "Hackathon 2025",
        date: "2025-11-01",
        registrations: 89
      },
      {
        id: 3,
        title: "AI Workshop",
        date: "2025-10-20",
        registrations: 67
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        count: upcomingEvents.length,
        upcomingEvents
      }
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get performance metrics
router.get('/performance-metrics', [authenticate, isFaculty], async (req, res) => {
  try {
    // Generate mock performance metrics
    const performanceMetrics = {
      daily: [85, 82, 88, 79, 91, 87, 83],
      weekly: [84.5, 86.2, 83.8, 87.1],
      monthly: [82.3, 84.7, 85.9, 86.5, 87.2, 85.8]
    };

    res.status(200).json({
      success: true,
      data: {
        performanceMetrics
      }
    });
  } catch (error) {
    console.error('Get performance metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
