import mongoose from 'mongoose';

export default async () => {
  // Close the database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  
  console.log('Global test teardown: Disconnected from test database');
};
