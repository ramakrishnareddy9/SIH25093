// Minimal test server to check basic functionality
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Import and use auth routes for testing - adding back carefully
try {
  const authRoutes = require('./src/routes/auth');
  const analyticsRoutes = require('./src/routes/analytics');
  const certificateRoutes = require('./src/routes/certificates');
  app.use('/api/auth', authRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/certificates', certificateRoutes);
  console.log('✅ Auth, analytics, and certificate routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  console.error('Stack:', error.stack);
}

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/api/test`);
});
