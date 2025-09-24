const Education = require('../models/Education');
const asyncHandler = require('express-async-handler');

// @desc    Get all education records for a student
// @route   GET /api/education
// @access  Private
const getEducation = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching education for user ID:', req.user.id);
    console.log('User object from request:', req.user);
    
    // Try both string and ObjectId formats for the query
    const education = await Education.find({ 
      $or: [
        { studentId: req.user.id },
        { studentId: req.user._id }
      ]
    }).sort('-startDate');
    
    console.log(`Found ${education.length} education records for user ${req.user.id}`);
    console.log('Education records:', JSON.stringify(education, null, 2));
    
    if (education.length === 0) {
      console.log('No education records found. Checking database collection...');
      const allEducations = await Education.find({}).limit(5);
      console.log('Sample of all education records in DB:', JSON.stringify(allEducations, null, 2));
    }
    
    res.json(education);
  } catch (error) {
    console.error('Error fetching education:', error);
    res.status(500).json({ 
      message: 'Error fetching education records',
      error: error.message,
      stack: error.stack 
    });
  }
});

// @desc    Add education record
// @route   POST /api/education
// @access  Private
const addEducation = asyncHandler(async (req, res) => {
  try {
    const {
      degree,
      institution,
      fieldOfStudy,
      startDate,
      endDate,
      gpa,
      description,
      isCurrent
    } = req.body;

    console.log('Creating education record for user:', req.user.id);
    console.log('Education data:', { degree, institution, startDate, endDate });

    const education = new Education({
      studentId: req.user.id, // Using the string ID from JWT
      degree,
      institution,
      fieldOfStudy,
      startDate,
      endDate,
      gpa,
      description,
      isCurrent
    });

    const createdEducation = await education.save();
    console.log('Created education record:', createdEducation);
    res.status(201).json(createdEducation);
  } catch (error) {
    console.error('Error creating education:', error);
    res.status(500).json({ message: 'Error creating education record', error: error.message });
  }
});

// @desc    Update education record
// @route   PUT /api/education/:id
// @access  Private
const updateEducation = asyncHandler(async (req, res) => {
  const education = await Education.findById(req.params.id);

  if (!education) {
    res.status(404);
    throw new Error('Education record not found');
  }

  // Make sure the education record belongs to the user
  if (education.studentId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this education record');
  }

  const {
    degree,
    institution,
    fieldOfStudy,
    startDate,
    endDate,
    gpa,
    description,
    isCurrent
  } = req.body;

  education.degree = degree || education.degree;
  education.institution = institution || education.institution;
  education.fieldOfStudy = fieldOfStudy || education.fieldOfStudy;
  education.startDate = startDate || education.startDate;
  education.endDate = endDate || education.endDate;
  education.gpa = gpa !== undefined ? gpa : education.gpa;
  education.description = description || education.description;
  education.isCurrent = isCurrent !== undefined ? isCurrent : education.isCurrent;

  const updatedEducation = await education.save();
  res.json(updatedEducation);
});

// @desc    Delete education record
// @route   DELETE /api/education/:id
// @access  Private
const deleteEducation = asyncHandler(async (req, res) => {
  const education = await Education.findById(req.params.id);

  if (!education) {
    res.status(404);
    throw new Error('Education record not found');
  }

  // Make sure the education record belongs to the user
  if (education.studentId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this education record');
  }

  await education.remove();
  res.json({ id: req.params.id });
});

module.exports = {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation
};
