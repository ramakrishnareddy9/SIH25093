import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import Achievement from '../../src/models/achievement.js';
import User from '../../src/models/User.js';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'student'
};

const testAdmin = {
  name: 'Test Admin',
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

describe('Achievement Controller', () => {
  let userToken;
  let adminToken;
  let testUserId;
  let testAchievementId;

  beforeAll(async () => {
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
    
    userToken = loginRes.body.token;

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

  describe('POST /api/achievements', () => {
    it('should create a new achievement', async () => {
      const res = await request(app)
        .post('/api/achievements')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testAchievement);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe(testAchievement.title);
      expect(res.body.data.status).toBe('pending');
      
      testAchievementId = res.body.data._id;
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .post('/api/achievements')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: '', // Invalid: empty title
          description: 'Short', // Invalid: too short
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/achievements', () => {
    it('should get all achievements', async () => {
      const res = await request(app)
        .get('/api/achievements')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/achievements/:id', () => {
    it('should get a single achievement', async () => {
      const res = await request(app)
        .get(`/api/achievements/${testAchievementId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(testAchievementId);
    });

    it('should return 404 for non-existent achievement', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/achievements/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/achievements/:id', () => {
    it('should update an achievement', async () => {
      const updates = {
        title: 'Updated Test Achievement',
        description: 'This is an updated test achievement'
      };
      
      const res = await request(app)
        .put(`/api/achievements/${testAchievementId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updates);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(updates.title);
      expect(res.body.data.description).toBe(updates.description);
    });
  });

  describe('DELETE /api/achievements/:id', () => {
    it('should delete an achievement', async () => {
      // First create a new achievement to delete
      const achievementRes = await request(app)
        .post('/api/achievements')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          ...testAchievement,
          title: 'Achievement to delete'
        });
      
      const achievementId = achievementRes.body.data._id;
      
      // Now delete it
      const res = await request(app)
        .delete(`/api/achievements/${achievementId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBe('Achievement deleted');
    });
  });

  describe('GET /api/achievements/me', () => {
    it('should get current user\'s achievements', async () => {
      const res = await request(app)
        .get('/api/achievements/me')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('PUT /api/achievements/:id/approve', () => {
    it('should approve an achievement (admin only)', async () => {
      // First create a pending achievement
      const achievementRes = await request(app)
        .post('/api/achievements')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          ...testAchievement,
          title: 'Achievement to approve'
        });
      
      const achievementId = achievementRes.body.data._id;
      
      // Now approve it as admin
      const res = await request(app)
        .put(`/api/achievements/${achievementId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('approved');
      expect(res.body.data.approvedBy).toBeDefined();
    });

    it('should return 403 for non-admin users', async () => {
      const res = await request(app)
        .put(`/api/achievements/${testAchievementId}/approve`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('PUT /api/achievements/:id/reject', () => {
    it('should reject an achievement with a reason (admin only)', async () => {
      // First create a pending achievement
      const achievementRes = await request(app)
        .post('/api/achievements')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          ...testAchievement,
          title: 'Achievement to reject'
        });
      
      const achievementId = achievementRes.body.data._id;
      const rejectionReason = 'Insufficient evidence provided';
      
      // Now reject it as admin
      const res = await request(app)
        .put(`/api/achievements/${achievementId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: rejectionReason });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('rejected');
      expect(res.body.data.rejectionReason).toBe(rejectionReason);
    });
  });

  describe('PUT /api/achievements/:id/toggle-visibility', () => {
    it('should toggle achievement visibility', async () => {
      // First get the current visibility
      const achievementRes = await request(app)
        .get(`/api/achievements/${testAchievementId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      const currentVisibility = achievementRes.body.data.isPublic;
      
      // Toggle visibility
      const res = await request(app)
        .put(`/api/achievements/${testAchievementId}/toggle-visibility`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isPublic).toBe(!currentVisibility);
      
      // Toggle back to original state
      await request(app)
        .put(`/api/achievements/${testAchievementId}/toggle-visibility`)
        .set('Authorization', `Bearer ${userToken}`);
    });
  });

  describe('GET /api/achievements/student/:studentId/stats', () => {
    it('should get achievement statistics for a student', async () => {
      const res = await request(app)
        .get(`/api/achievements/student/${testUserId}/stats`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('total');
      expect(res.body.data).toHaveProperty('approved');
      expect(res.body.data).toHaveProperty('pending');
      expect(res.body.data).toHaveProperty('rejected');
      expect(res.body.data).toHaveProperty('byType');
    });
  });
});
