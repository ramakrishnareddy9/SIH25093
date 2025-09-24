const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Achievement = require('../src/models/achievement');
const User = require('../src/models/User');

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'student'
};

const testAdmin = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

const testAchievement = {
  title: 'Test Achievement',
  type: 'academic',
  description: 'This is a test achievement',
  category: 'individual',
  skillsGained: ['JavaScript', 'Node.js'],
  isPublic: true
};

let authToken;
let adminToken;
let testUserId;
let testAchievementId;

describe('Achievement API Integration Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create test user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    testUserId = userRes.body.data.user._id;
    
    // Login test user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    authToken = loginRes.body.token;

    // Create admin user and login
    await User.create(testAdmin);
    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testAdmin.email,
        password: testAdmin.password
      });
    
    adminToken = adminLoginRes.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Achievement.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up achievements after each test
    await Achievement.deleteMany({});
  });

  describe('POST /api/achievements', () => {
    it('should create a new achievement', async () => {
      const res = await request(app)
        .post('/api/achievements')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testAchievement);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe(testAchievement.title);
      testAchievementId = res.body.data._id;
    });
  });

  describe('GET /api/achievements', () => {
    it('should get all achievements for the authenticated user', async () => {
      // First create a test achievement
      await request(app)
        .post('/api/achievements')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testAchievement);
      
      const res = await request(app)
        .get('/api/achievements')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data.length).toBe(1);
    });
  });

  describe('PATCH /api/achievements/:id/approve', () => {
    it('should approve an achievement (admin only)', async () => {
      // First create a test achievement
      const achievement = await request(app)
        .post('/api/achievements')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testAchievement);
      
      const res = await request(app)
        .patch(`/api/achievements/${achievement.body.data._id}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('approved');
    });
  });

  describe('DELETE /api/achievements/:id', () => {
    it('should delete an achievement', async () => {
      // First create a test achievement
      const achievement = await request(app)
        .post('/api/achievements')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testAchievement);
      
      const res = await request(app)
        .delete(`/api/achievements/${achievement.body.data._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      
      // Verify it's deleted
      const deletedAchievement = await Achievement.findById(achievement.body.data._id);
      expect(deletedAchievement).toBeNull();
    });
  });
});
