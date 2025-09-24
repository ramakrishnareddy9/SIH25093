const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Mock Firebase Admin
jest.mock('firebase-admin', () => {
  const auth = {
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user-id' })
  };
  return {
    credential: {
      cert: jest.fn()
    },
    initializeApp: jest.fn(),
    auth: jest.fn(() => auth)
  };
});

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/eduflow-test';
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.FIREBASE_CLIENT_EMAIL = 'test@example.com';
process.env.FIREBASE_PRIVATE_KEY = 'test-private-key';
process.env.FIREBASE_STORAGE_BUCKET = 'test-bucket';

let mongoServer;

// Set up in-memory database before tests
beforeAll(async () => {
  jest.setTimeout(60000); // Increase timeout to 60s
  
  // Start MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Disconnect and close the database after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
