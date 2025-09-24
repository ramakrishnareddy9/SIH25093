require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createTestUsers = async () => {
  try {
    await connectDB();

    // Test users data
    const testUsers = [
      {
        name: 'Demo Student',
        email: 'student@demo.com',
        password: 'student123',
        role: 'student',
        department: 'Computer Science'
      },
      {
        name: 'Demo Faculty',
        email: 'faculty@demo.com',
        password: 'faculty123',
        role: 'faculty',
        department: 'Computer Science'
      },
      {
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: 'admin123',
        role: 'admin',
        department: 'Administration'
      }
    ];

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword,
        authProvider: 'email',
        isVerified: true
      });

      await user.save();
      console.log(`Created user: ${userData.email} with password: ${userData.password}`);
    }

    console.log('Test users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
};

createTestUsers();
