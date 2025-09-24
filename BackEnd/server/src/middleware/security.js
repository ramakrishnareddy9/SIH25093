const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const { rateLimit: rateLimitConfig } = require('../config/config');

// Rate limiting
const limiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.max,
  message: 'Too many requests from this IP, please try again later.',
});

// Security headers and other security-related middleware
const securityMiddleware = [
  // Set security HTTP headers
  helmet(),
  
  // Prevent parameter pollution
  hpp(),
  
  // Data sanitization against NoSQL query injection
  mongoSanitize(),
  
  // Data sanitization against XSS
  xss(),
  
  // Enable CORS with options
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
  },
  
  // Rate limiting
  limiter,
  
  // Prevent XSS attacks
  (req, res, next) => {
    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');
    
    // Set X-Content-Type-Options
    res.header('X-Content-Type-Options', 'nosniff');
    
    // Set X-Frame-Options
    res.header('X-Frame-Options', 'DENY');
    
    // Set X-XSS-Protection
    res.header('X-XSS-Protection', '1; mode=block');
    
    // Set Content Security Policy
    res.header(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "connect-src 'self' https://api.example.com;"
    );
    
    next();
  },
];

module.exports = securityMiddleware;
