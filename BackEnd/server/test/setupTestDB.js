import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Achievement from '../src/models/achievement.js';

// Load environment variables
dotenv.config({ path: '.env.test' });

// Test data
const testUsers = [
  {
    name: 'Test Student',
    email: 'student@example.com',
    password: 'password123',
    role: 'student'
  },
  {
    name: 'Test Teacher',
    email: 'teacher@example.com',
    password: 'teacher123',
    role: 'teacher'
  },
  {
    name: 'Test Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  }
];

const testAchievements = [
  {
    title: 'Test Achievement 1',
    type: 'academic',
    description: 'First test achievement',
    category: 'individual',
    skillsGained: ['JavaScript', 'Node.js'],
    isPublic: true,
    status: 'pending'
  },
  {
    title: 'Test Achievement 2',
    type: 'sports',
    description: 'Second test achievement',
    category: 'team',
    skillsGained: ['Teamwork', 'Leadership'],
    isPublic: true,
    status: 'approved'
  },
  {
    title: 'Test Achievement 3',
    type: 'arts',
    description: 'Third test achievement',
    category: 'individual',
    skillsGained: ['Creativity', 'Design'],
    isPublic: false,
    status: 'rejected',
    rejectionReason: 'Insufficient evidence provided'
  }
];

async function setupTestDatabase() {
  try {
    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to test database');

    // Clear existing data
    await User.deleteMany({});
    await Achievement.deleteMany({});

    console.log('Cleared test data');

    // Create test users
    const createdUsers = [];
    for (const user of testUsers) {
      const newUser = new User(user);
      await newUser.save();
      createdUsers.push(newUser);
    }

    console.log('Created test users');

    // Create test achievements
    const student = createdUsers.find(u => u.role === 'student');
    const admin = createdUsers.find(u => u.role === 'admin');
    
    const achievementsWithUsers = testAchievements.map(achievement => ({
      ...achievement,
      student: student._id,
      approvedBy: achievement.status === 'approved' ? admin._id : undefined,
      reviewedBy: achievement.status === 'rejected' ? admin._id : undefined
    }));

    await Achievement.insertMany(achievementsWithUsers);
    console.log('Created test achievements');

    console.log('Test database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  }
}

setupTestDatabase();
