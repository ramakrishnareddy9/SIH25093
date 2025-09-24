const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, PDF, and DOC files are allowed.'), false);
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 5 // Maximum 5 files
  },
  fileFilter: fileFilter
});

// Error handling middleware for file uploads
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    logger.error(`Multer upload error: ${err.message}`);
    return res.status(400).json({
      success: false,
      message: err.message || 'Error uploading file',
      error: err.code
    });
  } else if (err) {
    // An unknown error occurred
    logger.error(`File upload error: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: err.message || 'Error processing file upload',
      error: 'UPLOAD_ERROR'
    });
  }
  // If no error, continue to next middleware
  next();
};

// Create the upload middleware with fields configuration
const uploadFiles = upload.fields([
  { name: 'files', maxCount: 5 } // Max 5 files per upload
]);

module.exports = {
  upload,
  uploadFiles,
  handleUploadError
};
