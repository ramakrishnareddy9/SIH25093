import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' });

// Mock the logger to prevent console output during tests
jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  child: () => ({
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn()
  })
}));

// Mock file upload middleware
jest.mock('../src/middleware/upload', () => ({
  upload: jest.fn().array('files', 5),
  handleFileUpload: jest.fn((req, res, next) => {
    req.files = [];
    next();
  })
}));

// Mock cloudinary upload
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: 'https://example.com/test.jpg',
        public_id: 'test123'
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
  }
}));

// Add test timeout
jest.setTimeout(30000);

// Global test hooks
beforeEach(async () => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset the test database
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  // All tests are done, cleanup
  await mongoose.connection.close();
});

// Global test utilities
const testUtils = {
  async createTestUser(userData = {}) {
    const User = (await import('../src/models/User.js')).default;
    const user = new User({
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      role: 'student',
      ...userData
    });
    await user.save();
    return user;
  },
  
  async createTestAchievement(achievementData = {}, userId) {
    const Achievement = (await import('../src/models/achievement.js')).default;
    const achievement = new Achievement({
      title: 'Test Achievement',
      type: 'academic',
      description: 'Test description',
      category: 'individual',
      skillsGained: ['Test Skill'],
      isPublic: true,
      status: 'pending',
      student: userId || (await this.createTestUser())._id,
      ...achievementData
    });
    await achievement.save();
    return achievement;
  },
  
  getAuthHeaders(token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  },
  
  async loginUser(app, credentials) {
    const res = await request(app)
      .post('/api/auth/login')
      .send(credentials);
    return res.body.token;
  }
};

// Make test utilities available globally
global.testUtils = testUtils;
