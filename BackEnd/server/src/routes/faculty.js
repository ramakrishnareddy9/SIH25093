const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all faculty
router.get('/', [authenticate], async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' })
      .select('id name email facultyId department designation specialization coursesTeaching experience qualifications researchPapers phone office officeHours')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: faculty.length,
      faculty
    });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get faculty by ID
router.get('/:id', [authenticate], async (req, res) => {
  try {
    const faculty = await User.findOne({
      _id: req.params.id,
      role: 'faculty'
    }).select('id name email facultyId department designation specialization coursesTeaching experience qualifications researchPapers phone office officeHours profileImage');

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    res.status(200).json({
      success: true,
      faculty
    });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get faculty by department
router.get('/department/:department', [authenticate], async (req, res) => {
  try {
    const { department } = req.params;
    const faculty = await User.find({
      role: 'faculty',
      department: { $regex: department, $options: 'i' }
    }).select('id name email facultyId department designation specialization coursesTeaching experience qualifications researchPapers');

    res.status(200).json({
      success: true,
      count: faculty.length,
      faculty
    });
  } catch (error) {
    console.error('Get faculty by department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get faculty statistics
router.get('/stats/overview', [authenticate, isAdmin], async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' });

    const departments = {};
    const designations = {};
    const specializations = {};

    let totalResearchPapers = 0;
    let totalExperience = 0;
    let totalCourses = 0;

    faculty.forEach(facultyMember => {
      // Count by department
      departments[facultyMember.department] = (departments[facultyMember.department] || 0) + 1;

      // Count by designation
      designations[facultyMember.designation] = (designations[facultyMember.designation] || 0) + 1;

      // Count specializations
      if (facultyMember.specialization) {
        specializations[facultyMember.specialization] = (specializations[facultyMember.specialization] || 0) + 1;
      }

      // Sum research papers and experience
      totalResearchPapers += facultyMember.researchPapers || 0;
      totalExperience += facultyMember.experience || 0;
      totalCourses += facultyMember.coursesTeaching ? facultyMember.coursesTeaching.length : 0;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalFaculty: faculty.length,
        departmentDistribution: Object.entries(departments).map(([name, count]) => ({
          department: name,
          count
        })),
        designationDistribution: Object.entries(designations).map(([name, count]) => ({
          designation: name,
          count
        })),
        topSpecializations: Object.entries(specializations)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({
            specialization: name,
            count
          })),
        averageExperience: faculty.length > 0 ? Math.round(totalExperience / faculty.length) : 0,
        totalResearchPapers,
        totalCoursesTaught: totalCourses
      }
    });
  } catch (error) {
    console.error('Get faculty stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get faculty courses
router.get('/:id/courses', [authenticate], async (req, res) => {
  try {
    const faculty = await User.findOne({
      _id: req.params.id,
      role: 'faculty'
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    // In a real application, you would fetch from a Course model
    // For now, return mock course data
    const courses = faculty.coursesTeaching ? faculty.coursesTeaching.map((courseCode, index) => ({
      id: index + 1,
      code: courseCode,
      name: `Course ${courseCode}`,
      description: `Description for ${courseCode}`,
      semester: Math.floor(index / 3) + 1,
      year: new Date().getFullYear(),
      studentsEnrolled: Math.floor(Math.random() * 60) + 20,
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday'][index % 3],
        time: `${9 + index}:00 AM - ${10 + index}:00 AM`
      }
    })) : [];

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get faculty courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
