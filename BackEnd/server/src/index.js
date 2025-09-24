// Load environment variables
const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

console.log('Environment variables loaded successfully');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '*** (set)' : 'Not set');

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const cors = require('cors');

// Import configurations
const { validateEnvironment, port, isProduction } = require('./config/config');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Import middleware
// const securityMiddleware = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');
const certificateRoutes = require('./routes/certificates');
const categoryRoutes = require('./routes/categories');
const testRoutes = require('./routes/test');
const aiRoutes = require('./routes/ai');
const achievementRoutes = require('./routes/achievementRoutes');
const educationRoutes = require('./routes/educationRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const studentsRoutes = require('./routes/students');
const activitiesRoutes = require('./routes/activities');
const eventsRoutes = require('./routes/events');
const facultyRoutes = require('./routes/faculty');
const analyticsRoutes = require('./routes/analytics');

// Validate environment variables
validateEnvironment();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// // Initialize Firebase Admin
// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//   }),
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET
// });

// Apply security middleware
// securityMiddleware.forEach(middleware => app.use(middleware));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Set up static file serving for uploads
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info(`Created uploads directory at ${uploadsDir}`);
}

app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, path) => {
    // Set cache control headers for uploaded files
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
  logger.info(`Created logs directory at ${logsDir}`);
}

// Handle file upload errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        success: false, 
        message: 'File size too large. Maximum size is 5MB.' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: err.message || 'Error uploading file' 
    });
  } else if (err) {
    // An unknown error occurred
    console.error('File upload error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during file upload' 
    });
  }
  next();
});

// Configure CORS
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  process.env.CLIENT_URL
].filter(Boolean); // Remove any falsy values

// Enable CORS for all routes - simplified for development
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests
app.options('*', cors());

// API Routes
const API_PREFIX = '/api';
const apiRoutes = [
  { path: '/auth', router: authRoutes },
  { path: '/courses', router: courseRoutes },
  { path: '/users', router: userRoutes },
  { path: '/certificates', router: certificateRoutes },
  { path: '/categories', router: categoryRoutes },
  { path: '/test', router: testRoutes },
  { path: '/ai', router: aiRoutes },
  { path: '/achievements', router: achievementRoutes },
  { path: '/portfolio', router: portfolioRoutes },
  { path: '/education', router: educationRoutes },
  { path: '/students', router: studentsRoutes },
  { path: '/activities', router: activitiesRoutes },
  { path: '/events', router: eventsRoutes },
  { path: '/faculty', router: facultyRoutes },
  { path: '/analytics', router: analyticsRoutes },
];

// Register all API routes
apiRoutes.forEach(route => {
  app.use(`${API_PREFIX}${route.path}`, route.router);
  logger.info(`Registered route: ${API_PREFIX}${route.path}`);
});

// API Welcome route
app.get('/api', (req, res) => {
  res.send('Welcome to EduFlow API - Online Learning Platform');
});

// Serve frontend in production
if (isProduction) {
  console.log('Running in production mode, serving static files');
  
  // Define possible build paths in order of preference
  const possibleBuildPaths = [
    path.join(__dirname, '../public'),
    path.join(__dirname, '../../client/build'),
    path.join(__dirname, '../../client/dist'),
    path.join(process.cwd(), 'client/build'),
    path.join(process.cwd(), 'client/dist'),
    path.join(process.cwd(), 'dist')
  ];
  
  // Find the first path that exists
  let clientBuildPath = null;
  for (const buildPath of possibleBuildPaths) {
    try {
      if (fs.existsSync(path.join(buildPath, 'index.html'))) {
        clientBuildPath = buildPath;
        break;
      }
    } catch (err) {
      console.log(`Path ${buildPath} not accessible`);
    }
  }
  
  if (!clientBuildPath) {
    console.error('Could not find client build directory!');
    console.error('Searched paths:', possibleBuildPaths);
    clientBuildPath = path.join(__dirname, '../public'); // Fallback path
  }
  
  console.log('Client build path:', clientBuildPath);
  
  // Serve static files
  app.use(express.static(clientBuildPath));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next(); // Let API routes handle API requests
    }
    
    const indexPath = path.join(clientBuildPath, 'index.html');
    console.log(`Attempting to serve: ${indexPath}`);
    
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Client application not found. Please check build configuration.');
    }
  });
} else {
  // Welcome route for development
  app.get('/', (req, res) => {
    res.send('Welcome to EduFlow API - Development Mode');
  });
}

// Error handling middleware - must be after all other middleware and routes
app.use(errorHandler);

// Connect to MongoDB
connectDB().then(() => {
  logger.info('MongoDB connected successfully');
  
  // Start the server
  const serverPort = port || 5000;
  server.listen(serverPort, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${serverPort}`);
    
    // Log server information
    logger.info(`Process ID: ${process.pid}`);
    logger.info(`Node version: ${process.version}`);
    logger.info(`Platform: ${process.platform} ${process.arch}`);
    logger.info(`Memory usage: ${JSON.stringify(process.memoryUsage())}`);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err);
    server.close(() => {
      process.exit(1);
    });
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger.error(err);
    server.close(() => {
      process.exit(1);
    });
  });
  
  // Handle SIGTERM (for Docker, Kubernetes, etc.)
  process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      logger.info('💥 Process terminated!');
      process.exit(0);
    });
  });
}).catch((err) => {
  logger.error('Failed to connect to MongoDB:', err);
  
  // In development, start server with limited functionality
  if (!isProduction) {
    const PORT = process.env.PORT || 5005;
    server.listen(PORT, () => {
      logger.warn(`⚠️ Server running on port ${PORT} WITHOUT database connection`);
      logger.warn('API endpoints requiring database access will not work');
    });
    
    // Override routes with error message when DB is unavailable
    app.use('/api', (req, res, next) => {
      if (req.path === '/health') {
        return res.status(503).json({
          status: 'error',
          message: 'Service Unavailable - Database connection failed'
        });
      }
      next();
    });
  } else {
    // In production, exit if database connection fails
    process.exit(1);
  }
});
