const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const AVATARS_DIR = path.join(UPLOADS_DIR, 'avatars');

// Create directories if they don't exist
const createDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
};

// Set directory permissions
const setPermissions = (dir) => {
  try {
    // On Windows, we can't set Unix-style permissions, but we can ensure the directory is writable
    fs.accessSync(dir, fs.constants.W_OK);
    console.log(`Write permissions verified for: ${dir}`);
  } catch (err) {
    console.error(`Error setting permissions for ${dir}:`, err);
  }
};

// Main setup function
const setupUploads = () => {
  try {
    // Create uploads and avatars directories
    createDirectory(UPLOADS_DIR);
    createDirectory(AVATARS_DIR);

    // Set permissions
    setPermissions(UPLOADS_DIR);
    setPermissions(AVATARS_DIR);

    console.log('Uploads directory setup completed successfully');
  } catch (error) {
    console.error('Error setting up uploads directory:', error);
    process.exit(1);
  }
};

// Run the setup
setupUploads();
