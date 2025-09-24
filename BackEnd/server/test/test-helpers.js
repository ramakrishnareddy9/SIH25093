const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const Achievement = require('../src/models/achievement');

// Test user data
const testUserData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'student'
};

const testAdminData = {
  name: 'Test Admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

// Test achievement data
const testAchievementData = {
  title: 'Test Achievement',
  type: 'academic',
  description: 'This is a test achievement',
  category: 'individual',
  skillsGained: ['JavaScript', 'Node.js'],
  isPublic: true
};

/**
 * Create a test user and return the user object and auth token
 * @param {Object} userData - User data to create
 * @returns {Promise<{user: Object, token: string}>}
 */
const createTestUser = async (userData = testUserData) => {
  const user = await User.create(userData);
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  return { user, token };
};

/**
 * Create a test achievement
 * @param {Object} achievementData - Achievement data
 * @param {string} userId - ID of the user who owns the achievement
 * @returns {Promise<Object>} Created achievement
 */
const createTestAchievement = async (achievementData = {}, userId) => {
  const achievement = new Achievement({
    ...testAchievementData,
    ...achievementData,
    student: userId || new mongoose.Types.ObjectId(),
    status: achievementData.status || 'pending'
  });
  return await achievement.save();
};

/**
 * Clean up the test database
 */
const cleanupTestDatabase = async () => {
  await User.deleteMany({});
  await Achievement.deleteMany({});
};

/**
 * Generate auth headers for API requests
 * @param {string} token - JWT token
 * @returns {Object} Headers object with Authorization
 */
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

/**
 * Generate a random email for testing
 * @returns {string} Random email
 */
const generateRandomEmail = () => {
  return `test-${Math.random().toString(36).substring(2, 15)}@example.com`;
};

module.exports = {
  testUserData,
  testAdminData,
  testAchievementData,
  createTestUser,
  createTestAchievement,
  cleanupTestDatabase,
  getAuthHeaders,
  generateRandomEmail
};
