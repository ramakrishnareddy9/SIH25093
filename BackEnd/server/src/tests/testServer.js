const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, connectDB } = require('../../app');

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  credential: {
    cert: jest.fn()
  },
  initializeApp: jest.fn(),
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user-id' })
  }))
}));

// Set up test environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.FIREBASE_CLIENT_EMAIL = 'test@example.com';
process.env.FIREBASE_PRIVATE_KEY = 'test-private-key';
process.env.FIREBASE_STORAGE_BUCKET = 'test-bucket';

let mongoServer;
let server;

// Create a test server instance
const setupTestServer = async () => {
  // Start MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  
  // Connect to the in-memory database
  await connectDB();
  
  // Create a test server
  server = app.listen(0); // Use random available port
  
  return { 
    app, 
    server,
    mongoServer 
  };
};

// Clean up after tests
const teardownTestServer = async (mongoServer) => {
  if (server) {
    server.close();
  }
  
  // Clear all test data
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  
  // Disconnect and close the database
  await mongoose.disconnect();
  
  if (mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = {
  setupTestServer,
  teardownTestServer
};
