const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { generatePortfolioPdf } = require('../controllers/portfolioController');

// All routes are protected and require authentication
router.use(authenticate);

// POST /api/portfolio/generate-pdf - Generate a PDF of the student's portfolio
router.post('/generate-pdf', generatePortfolioPdf);

module.exports = router;
