const logger = require('../utils/logger');

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRATION',
  'JWT_REFRESH_EXPIRATION',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USERNAME',
  'EMAIL_PASSWORD',
  'EMAIL_FROM',
  'CLIENT_URL',
  'API_URL'
];

const validateEnvironment = () => {
  const missingVars = [];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  // Log environment info
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  
  // Don't log sensitive information in production
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`MongoDB URI: ${process.env.MONGODB_URI}`);
  }
};

module.exports = {
  validateEnvironment,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  
  // Server
  port: process.env.PORT || 5000,
  apiUrl: process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`,
  
  // JWT
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION || '15m',  // 15 minutes
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION || '7d',    // 7 days
    resetPasswordExpirationMinutes: process.env.JWT_RESET_PASSWORD_EXPIRATION || '10m',
    verifyEmailExpirationHours: process.env.JWT_VERIFY_EMAIL_EXPIRATION || '24h',
    issuer: process.env.JWT_ISSUER || 'smart-student-hub',
    audience: ['student', 'faculty', 'admin']
  },
  
  // Email
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
    supportEmail: process.env.SUPPORT_EMAIL || 'support@smartstudenthub.com'
  },
  
  // Client
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // CORS
  corsOptions: {
    origin: process.env.CORS_ORIGIN || process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    maxAge: 86400, // 24 hours
  },
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  },
};
