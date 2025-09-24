const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Achievement = require('../src/models/achievement');
const User = require('../src/models/User');

// Test data
const testStudent = {
  name: 'Test Student',
  email: 'student@example.com',
  password: 'password123',
  role: 'student'
};

const testTeacher = {
  name: 'Test Teacher',
  email: 'teacher@example.com',
  password: 'teacher123',
  role: 'teacher'
};

const testAdmin = {
  name: 'Test Admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

const testAchievement = {
  title: 'Test Achievement for Approval',
  type: 'academic',
  description: 'This achievement needs approval',
  category: 'individual',
  skillsGained: ['Testing'],
  isPublic: true
};

let studentToken;
let teacherToken;
let adminToken;
let achievementId;

describe('Achievement Approval Workflow', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create test users
    await request(app).post('/api/auth/register').send(testStudent);
    await request(app).post('/api/auth/register').send(testTeacher);
    await request(app).post('/api/auth/register').send(testAdmin);

    // Login users and get tokens
    const studentLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: testStudent.email, password: testStudent.password });
    studentToken = studentLogin.body.token;

    const teacherLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: testTeacher.email, password: testTeacher.password });
    teacherToken = teacherLogin.body.token;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: testAdmin.email, password: testAdmin.password });
    adminToken = adminLogin.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Achievement.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Student submits achievement', () => {
    it('should create a new achievement with pending status', async () => {
      const res = await request(app)
        .post('/api/achievements')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(testAchievement);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('pending');
      
      achievementId = res.body.data._id;
    });
  });

  describe('Teacher reviews achievement', () => {
    it('should allow teacher to view pending achievements', async () => {
      const res = await request(app)
        .get('/api/achievements/pending')
        .set('Authorization', `Bearer ${teacherToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should allow teacher to approve achievement', async () => {
      const res = await request(app)
        .put(`/api/achievements/${achievementId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('approved');
      expect(res.body.data.approvedBy).toBeDefined();
    });

    it('should not allow duplicate approval', async () => {
      const res = await request(app)
        .put(`/api/achievements/${achievementId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Student views approved achievement', () => {
    it('should show approved status to student', async () => {
      const res = await request(app)
        .get(`/api/achievements/${achievementId}`)
        .set('Authorization', `Bearer ${studentToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.status).toBe('approved');
    });

    it('should include achievement in student profile', async () => {
      const res = await request(app)
        .get('/api/achievements/me')
        .set('Authorization', `Bearer ${studentToken}`);
      
      expect(res.statusCode).toEqual(200);
      const achievement = res.body.data.find(a => a._id === achievementId);
      expect(achievement).toBeDefined();
      expect(achievement.status).toBe('approved');
    });
  });

  describe('Rejection workflow', () => {
    let newAchievementId;
    
    beforeAll(async () => {
      // Create another achievement for rejection test
      const res = await request(app)
        .post('/api/achievements')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          ...testAchievement,
          title: 'Achievement to be rejected'
        });
      
      newAchievementId = res.body.data._id;
    });

    it('should allow teacher to reject with a reason', async () => {
      const rejectionReason = 'Insufficient evidence provided';
      
      const res = await request(app)
        .put(`/api/achievements/${newAchievementId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: rejectionReason });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('rejected');
      expect(res.body.data.rejectionReason).toBe(rejectionReason);
    });

    it('should show rejection reason to student', async () => {
      const res = await request(app)
        .get(`/api/achievements/${newAchievementId}`)
        .set('Authorization', `Bearer ${studentToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.status).toBe('rejected');
      expect(res.body.data.rejectionReason).toBeDefined();
    });
  });

  describe('Visibility control', () => {
    it('should allow student to toggle achievement visibility', async () => {
      // Toggle to private
      const res1 = await request(app)
        .put(`/api/achievements/${achievementId}/toggle-visibility`)
        .set('Authorization', `Bearer ${studentToken}`);
      
      expect(res1.statusCode).toEqual(200);
      expect(res1.body.data.isPublic).toBe(false);

      // Toggle back to public
      const res2 = await request(app)
        .put(`/api/achievements/${achievementId}/toggle-visibility`)
        .set('Authorization', `Bearer ${studentToken}`);
      
      expect(res2.statusCode).toEqual(200);
      expect(res2.body.data.isPublic).toBe(true);
    });

    it('should not allow other students to change visibility', async () => {
      // Create another student
      const otherStudent = {
        name: 'Other Student',
        email: 'other@example.com',
        password: 'password123',
        role: 'student'
      };

      await request(app).post('/api/auth/register').send(otherStudent);
      
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: otherStudent.email, password: otherStudent.password });
      
      const otherStudentToken = loginRes.body.token;

      // Try to toggle visibility of first student's achievement
      const res = await request(app)
        .put(`/api/achievements/${achievementId}/toggle-visibility`)
        .set('Authorization', `Bearer ${otherStudentToken}`);
      
      expect(res.statusCode).toEqual(403);
    });
  });
});
