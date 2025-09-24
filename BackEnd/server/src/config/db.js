const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const connectionOptions = {
      serverSelectionTimeoutMS: 30000, // 30s timeout
      socketTimeoutMS: 45000,          // 45s socket timeout
      maxPoolSize: 10,
      retryWrites: true,
      tls: true,                       // ✅ Force TLS for Atlas
      family: 4                        // ✅ Force IPv4 (fixes DNS/TLS issues on Windows)
    };

    logger.info('Attempting to connect to MongoDB Atlas Cloud...');
    logger.info(`Connection URI: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);

    const conn = await mongoose.connect(process.env.MONGODB_URI, connectionOptions);

    logger.info(`✅ MongoDB Atlas Connected Successfully!`);
    logger.info(`🌐 Host: ${conn.connection.host}`);
    logger.info(`🗄️  Database: ${conn.connection.name}`);
    logger.info(`🔌 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    logger.info(`📊 Connection Pool Size: ${connectionOptions.maxPoolSize}`);

    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB Cloud');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB Cloud');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('Mongoose reconnected to MongoDB Cloud');
    });

    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('Mongoose connection closed through app termination');
        process.exit(0);
      } catch (error) {
        logger.error(`Error closing MongoDB connection: ${error.message}`);
        process.exit(1);
      }
    });

    process.on('SIGTERM', async () => {
      try {
        await mongoose.connection.close();
        logger.info('Mongoose connection closed through SIGTERM');
        process.exit(0);
      } catch (error) {
        logger.error(`Error closing MongoDB connection: ${error.message}`);
        process.exit(1);
      }
    });

    return conn;

  } catch (error) {
    logger.error(`❌ MongoDB Atlas connection failed: ${error.message}`);

    if (error.name === 'MongooseServerSelectionError') {
      logger.error('🔍 MongoDB Atlas Server Selection Failed. Please check:');
      logger.error('1. ✅ MongoDB Atlas URI is correct (mongodb+srv://...)');
      logger.error('2. 🌐 Internet connectivity is working');
      logger.error('3. 🔐 MongoDB Atlas IP whitelist includes your IP (0.0.0.0/0 for dev)');
      logger.error('4. 👤 Database user credentials are correct');
      logger.error('5. 🔑 Database user has proper permissions (readWrite)');
      logger.error('6. 🏗️  Cluster is running and not paused');
    }

    logger.error('💡 For MongoDB Atlas setup help, visit: https://www.mongodb.com/docs/atlas/');
    process.exit(1);
  }
};

module.exports = connectDB;
