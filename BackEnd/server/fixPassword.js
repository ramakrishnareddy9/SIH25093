require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const fixPasswordDirectly = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Hash the password with the same cost as the model
    const hashedPassword = await bcrypt.hash('student123', 12);
    console.log('Generated hash with cost 12');

    // Update directly in database to bypass mongoose hooks
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'student@demo.com' },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );

    console.log('Update result:', result.modifiedCount, 'document(s) modified');

    // Test the password
    const User = require('./src/models/User');
    const user = await User.findOne({ email: 'student@demo.com' }).select('+password');
    if (user) {
      const isValid = await bcrypt.compare('student123', user.password);
      console.log('Password verification:', isValid);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

fixPasswordDirectly();
