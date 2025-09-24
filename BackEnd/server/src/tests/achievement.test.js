const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Achievement = require('../models/achievement');
const User = require('../models/User');

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

const testAchievement = {
  title: 'Test Achievement',
  type: 'academic',
  description: 'This is a test achievement',
  status: 'Pending'
};

let studentToken;
let teacherToken;
let adminToken;
let achievementId;

beforeAll(async () => {
  // Clear test database
  await User.deleteMany({});
  await Achievement.deleteMany({});

  // Create test users
  const studentRes = await request(app)
    .post('/api/auth/register')
    .send(testStudent);
  
  const teacherRes = await request(app)
    .post('/api/auth/register')
    .send(testTeacher);
    
  const adminRes = await request(app)
    .post('/api/auth/register')
    .send(testAdmin);
    
  // Login to get tokens
  const studentLogin = await request(app)
    .post('/api/auth/login')
    .send({
      email: testStudent.email,
      password: testStudent.password
    });
    
  const teacherLogin = await request(app)
    .post('/api/auth/login')
    .send({
      email: testTeacher.email,
      password: testTeacher.password
    });
    
  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({
      email: testAdmin.email,
      password: testAdmin.password
    });
    
  studentToken = studentLogin.body.token;
  teacherToken = teacherLogin.body.token;
  adminToken = adminLogin.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Achievement API', () => {
  // Test student uploads an achievement
  test('Student can upload an achievement', async () => {
    const res = await request(app)
      .post('/api/achievements')
      .set('Authorization', `Bearer ${studentToken}`)
      .field('title', testAchievement.title)
      .field('type', testAchievement.type)
      .field('description', testAchievement.description)
      .attach('evidenceFile', 'test/test-image.jpg');
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(testAchievement.title);
    
    // Save the achievement ID for later tests
    achievementId = res.body.data._id;
  });
  
  // Test teacher can view pending achievements
  test('Teacher can view pending achievements', async () => {
    const res = await request(app)
      .get('/api/achievements/pending')
      .set('Authorization', `Bearer ${teacherToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });
  
  // Test teacher can approve an achievement
  test('Teacher can approve an achievement', async () => {
    const res = await request(app)
      .put(`/api/achievements/${achievementId}/approve`)
      .set('Authorization', `Bearer ${teacherToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Approved');
  });
  
  // Test admin can view all achievements
  test('Admin can view all achievements', async () => {
    const res = await request(app)
      .get('/api/achievements')
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });
  
  // Test student can view their achievements
  test('Student can view their achievements', async () => {
    const res = await request(app)
      .get('/api/achievements/student')
      .set('Authorization', `Bearer ${studentToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
