require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const testLogin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test credentials
    const testEmail = 'student@demo.com';
    const testPassword = 'student123';

    console.log('Testing login for:', testEmail);

    // Find user by email
    const user = await User.findOne({ email: testEmail }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found in database');
      return;
    }

    console.log('User details:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    });

    // Check password
    const isPasswordCorrect = await bcrypt.compare(testPassword, user.password);
    console.log('Password correct:', isPasswordCorrect);

    if (isPasswordCorrect) {
      console.log('✅ LOGIN SUCCESS: Credentials are valid');
    } else {
      console.log('❌ LOGIN FAILED: Invalid password');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error testing login:', error);
    process.exit(1);
  }
};

testLogin();
