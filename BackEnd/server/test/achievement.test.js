const request = require('supertest');
const app = require('../app');
const {
  testUserData,
  testAdminData,
  testAchievementData,
  createTestUser,
  createTestAchievement,
  getAuthHeaders,
  cleanupTestDatabase
} = require('./test-helpers');

let user;
let admin;
let userToken;
let adminToken;
let testAchievement;

describe('Achievement API', () => {
  beforeAll(async () => {
    // Setup test users
    const userData = await createTestUser(testUserData);
    user = userData.user;
    userToken = userData.token;

    const adminData = await createTestUser(testAdminData);
    admin = adminData.user;
    adminToken = adminData.token;
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/achievements', () => {
    it('should create a new achievement', async () => {
      const res = await request(app)
        .post('/api/achievements')
        .set(getAuthHeaders(userToken))
        .send(testAchievementData);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toMatchObject({
        success: true,
        data: {
          title: testAchievementData.title,
          description: testAchievementData.description,
          status: 'pending',
          student: user._id.toString(),
          isPublic: true
        }
      });
      expect(res.body.data).toHaveProperty('_id');
      
      testAchievement = res.body.data;
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .post('/api/achievements')
        .set(getAuthHeaders(userToken))
        .send({
          title: '', // Invalid: empty title
          description: 'Short', // Invalid: too short
          type: 'invalid-type' // Invalid type
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeInstanceOf(Array);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/api/achievements')
        .send(testAchievementData);
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/achievements', () => {
    beforeEach(async () => {
      // Create test achievements
      await createTestAchievement({}, user._id);
      await createTestAchievement({ status: 'approved' }, user._id);
      await createTestAchievement({ isPublic: false }, user._id);
    });

    it('should get all public achievements for unauthenticated users', async () => {
      const res = await request(app).get('/api/achievements');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      // Should only return public achievements
      const allPublic = res.body.data.every(a => a.isPublic === true);
      expect(allPublic).toBe(true);
    });

    it('should get all achievements for admin', async () => {
      const res = await request(app)
        .get('/api/achievements')
        .set(getAuthHeaders(adminToken));
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(3); // All test achievements
    });

    it('should filter achievements by status', async () => {
      const res = await request(app)
        .get('/api/achievements?status=approved')
        .set(getAuthHeaders(adminToken));
      
      expect(res.statusCode).toEqual(200);
      const allApproved = res.body.data.every(a => a.status === 'approved');
      expect(allApproved).toBe(true);
    });
  });

  describe('GET /api/achievements/:id', () => {
    let achievement;

    beforeEach(async () => {
      achievement = await createTestAchievement({}, user._id);
    });

    it('should get a single achievement', async () => {
      const res = await request(app)
        .get(`/api/achievements/${achievement._id}`)
        .set(getAuthHeaders(userToken));
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject({
        success: true,
        data: {
          _id: achievement._id.toString(),
          title: testAchievementData.title,
          student: user._id.toString()
        }
      });
    });

    it('should return 404 for non-existent achievement', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/achievements/${nonExistentId}`)
        .set(getAuthHeaders(userToken));
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 403 for private achievement of another user', async () => {
      const privateAchievement = await createTestAchievement({
        isPublic: false,
        student: new mongoose.Types.ObjectId() // Different user
      });
      
      const res = await request(app)
        .get(`/api/achievements/${privateAchievement._id}`)
        .set(getAuthHeaders(userToken));
      
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('PATCH /api/achievements/:id/approve', () => {
    it('should approve an achievement (admin only)', async () => {
      const res = await request(app)
        .patch(`/api/achievements/${testAchievement._id}/approve`)
        .set(getAuthHeaders(adminToken));
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('approved');
      expect(res.body.data.approvedBy).toBeDefined();
    });

    it('should return 403 for non-admin users', async () => {
      const res = await request(app)
        .patch(`/api/achievements/${testAchievementId}/approve`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('PATCH /api/achievements/:id/toggle-visibility', () => {
    it('should toggle achievement visibility', async () => {
      // Get current visibility
      const achievement = await Achievement.findById(testAchievementId);
      const initialVisibility = achievement.isPublic;
      
      const res = await request(app)
        .patch(`/api/achievements/${testAchievementId}/toggle-visibility`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isPublic).toBe(!initialVisibility);
    });
  });

  describe('DELETE /api/achievements/:id', () => {
    it('should delete an achievement', async () => {
      // Create a new achievement to delete
      const achievement = new Achievement({
        ...testAchievement,
        student: testUserId
      });
      await achievement.save();
      
      const res = await request(app)
        .delete(`/api/achievements/${achievement._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      
      // Verify it's deleted
      const deletedAchievement = await Achievement.findById(achievement._id);
      expect(deletedAchievement).toBeNull();
    });
  });
});
