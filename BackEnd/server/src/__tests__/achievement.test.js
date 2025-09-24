const request = require('supertest');
const mongoose = require('mongoose');
const { setupTestServer, teardownTestServer } = require('./testServer');

// Test data
const testStudent = {
  name: 'Test Student',
  email: 'test.student@example.com',
  password: 'password123',
  role: 'student'
};

const testTeacher = {
  name: 'Test Teacher',
  email: 'test.teacher@example.com',
  password: 'password123',
  role: 'teacher'
};

const testAdmin = {
  name: 'Test Admin',
  email: 'test.admin@example.com',
  password: 'password123',
  role: 'admin'
};

let app;
let server;
let mongoServer;
let studentToken;
let teacherToken;
let adminToken;
let testAchievementId;

// Helper function to make authenticated requests
const makeRequest = (server) => {
  return request(server);
};

describe('Achievement API', () => {
  beforeAll(async () => {
    // Set up test server and get instances
    const { app: testApp, server: testServer, mongoServer: testMongoServer } = await setupTestServer();
    app = testApp;
    server = testServer;
    mongoServer = testMongoServer;
    
    const req = makeRequest(server);
    
    // Create test users
    await req.post('/api/auth/register').send(testStudent);
    await req.post('/api/auth/register').send(testTeacher);
    await req.post('/api/auth/register').send(testAdmin);

    // Login to get tokens
    const studentRes = await req
      .post('/api/auth/login')
      .send({ email: testStudent.email, password: testStudent.password });
    
    const teacherRes = await req
      .post('/api/auth/login')
      .send({ email: testTeacher.email, password: testTeacher.password });
    
    const adminRes = await req
      .post('/api/auth/login')
      .send({ email: testAdmin.email, password: testAdmin.password });
    
    studentToken = studentRes.body.token;
    teacherToken = teacherRes.body.token;
    adminToken = adminRes.body.token;
  });

  afterAll(async () => {
    await teardownTestServer(mongoServer);
  });

  describe('POST /api/achievements', () => {
    it('should allow a student to upload an achievement', async () => {
      const req = makeRequest(server);
      const res = await req
        .post('/api/achievements')
        .set('Authorization', `Bearer ${studentToken}`)
        .field('title', 'Test Achievement')
        .field('type', 'academic')
        .field('description', 'This is a test achievement')
        .attach('evidence', 'test/test-image.txt');
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.status).toBe('Pending');
      
      // Save the achievement ID for later tests
      testAchievementId = res.body.data._id;
    });

    it('should not allow non-students to upload achievements', async () => {
      const req = makeRequest(server);
      const res = await req
        .post('/api/achievements')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          title: 'Test Achievement',
          type: 'academic',
          description: 'This should fail'
        });
      
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('GET /api/achievements/student', () => {
    it('should return achievements for the logged-in student', async () => {
      const req = makeRequest(server);
      const res = await req
        .get('/api/achievements/student')
        .set('Authorization', `Bearer ${studentToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/achievements/pending', () => {
    it('should return pending achievements for teachers', async () => {
      const req = makeRequest(server);
      const res = await req
        .get('/api/achievements/pending')
        .set('Authorization', `Bearer ${teacherToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });
  });

  describe('PUT /api/achievements/:id/approve', () => {
    it('should allow a teacher to approve an achievement', async () => {
      const req = makeRequest(server);
      const res = await req
        .put(`/api/achievements/${testAchievementId}/approve`)
        .set('Authorization', `Bearer ${teacherToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.status).toBe('Approved');
    });
  });

  describe('GET /api/achievements (admin)', () => {
    it('should return all achievements for admin', async () => {
      const req = makeRequest(server);
      const res = await req
        .get('/api/achievements')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });
  });
});
