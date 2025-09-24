const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Education = require('../models/Education');
const Achievement = require('../models/achievement');
const { generatePdf } = require('../services/pdfService');
const path = require('path');
const fs = require('fs');

// @desc    Generate a PDF of the student's portfolio
// @route   POST /api/portfolio/generate-pdf
// @access  Private
const generatePortfolioPdf = asyncHandler(async (req, res) => {
  try {
    console.log('Generating portfolio PDF for user:', req.user.id);
    
    // Get user data with more detailed error handling
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({ 
        success: false, 
        message: 'User not found',
        userId: req.user.id
      });
    }

    console.log('Found user:', user.email);

    // Get education and achievements
    const [education, achievements] = await Promise.all([
      Education.find({ studentId: req.user.id }).sort('-startDate'),
      Achievement.find({ studentId: req.user.id }).sort('-date')
    ]);

    console.log(`Found ${education.length} education records and ${achievements.length} achievements`);

    // Get enrolled courses and certificates
    const enrolledCourses = user.enrolledCourses || [];
    const certificates = user.certificates || [];
    
    console.log(`User has ${enrolledCourses.length} enrolled courses and ${certificates.length} certificates`);

    // Prepare data for the PDF template
    const data = {
      student: {
        name: user.name,
        email: user.email,
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        social: user.social || {},
        photoURL: user.photoURL || ''
      },
      education,
      achievements,
      enrolledCourses,
      certificates,
      currentDate: new Date().toLocaleDateString()
    };
    
    console.log('Generating PDF with data:', {
      student: { name: user.name, email: user.email },
      educationCount: education.length,
      achievementsCount: achievements.length,
      enrolledCoursesCount: enrolledCourses.length,
      certificatesCount: certificates.length
    });
    
    // Generate the PDF
    const pdfPath = await generatePdf('portfolio', data);
    
    // Send the generated PDF
    res.download(pdfPath, 'portfolio.pdf', (err) => {
      if (err) {
        console.error('Error sending PDF:', err);
        return res.status(500).json({
          success: false,
          message: 'Error sending PDF file',
          error: err.message
        });
      }
      
      // Delete the temporary file after sending
      fs.unlink(pdfPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting temporary PDF file:', unlinkErr);
        }
      });
    });
    
  } catch (error) {
    console.error('Error in generatePortfolioPdf:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating portfolio',
      error: error.message 
    });
  }
});

module.exports = {
  generatePortfolioPdf
};
