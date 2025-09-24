const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation
} = require('../controllers/educationController');

// All routes are protected and require authentication
router.use(authenticate);

// GET /api/education - Get all education records for the current user
router.get('/', getEducation);

// POST /api/education - Add a new education record
router.post('/', addEducation);

// PUT /api/education/:id - Update an education record
router.put('/:id', updateEducation);

// DELETE /api/education/:id - Delete an education record
router.delete('/:id', deleteEducation);

module.exports = router;
