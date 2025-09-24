const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Simple protected test endpoint (no role requirements)
router.get('/simple-test', authenticate, (req, res) => {
  console.log('Simple Test - req.user:', req.user);
  console.log('Simple Test - req.isDemo:', req.isDemo);
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'Simple authentication working!',
      user: req.user,
      isDemo: req.isDemo
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'No user found'
    });
  }
});

// Unprotected test endpoint
router.get('/no-auth', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'This endpoint works without authentication'
  });
});

module.exports = router;
