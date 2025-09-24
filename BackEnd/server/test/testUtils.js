const User = require('../src/models/User');
const Achievement = require('../src/models/achievement');

/**
 * Create a test user in the database
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user object
 */
const createTestUser = async (userData) => {
  return await User.create(userData);
};

/**
 * Get authentication token for a test user
 * @param {Object} app - Express app instance
 * @param {Object} credentials - User credentials {email, password}
 * @returns {Promise<String>} JWT token
 */
const getAuthToken = async (app, { email, password }) => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  
  return res.body.token;
};

/**
 * Create a test achievement
 * @param {Object} achievementData - Achievement data
 * @param {String} token - Authentication token
 * @returns {Promise<Object>} Created achievement
 */
const createTestAchievement = async (app, achievementData, token) => {
  const res = await request(app)
    .post('/api/achievements')
    .set('Authorization', `Bearer ${token}`)
    .send(achievementData);
  
  return res.body.data;
};

/**
 * Clean up test data
 */
const cleanupTestData = async () => {
  await User.deleteMany({});
  await Achievement.deleteMany({});
};

module.exports = {
  createTestUser,
  getAuthToken,
  createTestAchievement,
  cleanupTestData
};
