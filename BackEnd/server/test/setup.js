// Load environment variables for testing
require('dotenv').config({ path: '.env.test' });

// Set up global test configuration
process.env.NODE_ENV = 'test';

// Configure MongoDB connection for tests
const mongoose = require('mongoose');

// Global test hooks
beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  // Clean up test data after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Close the database connection after all tests
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Mock console methods to keep test output clean
const originalConsole = { ...console };

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  // Restore original console methods
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
});
