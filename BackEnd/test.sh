#!/bin/bash

# Start test database
echo "Starting test database..."
docker-compose -f docker-compose.test.yml up -d test-mongodb

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until docker exec test-mongodb mongosh --eval "print('MongoDB is ready')" &>/dev/null; do
    echo "Waiting for MongoDB..."
    sleep 1
done

# Set environment variables
export NODE_ENV=test
export MONGO_URI_TEST=mongodb://localhost:27017/student_hub_test

# Run tests
echo "Running tests..."
npm test -- --detectOpenHandles --forceExit

# Stop test database
echo "Stopping test database..."
docker-compose -f docker-compose.test.yml down

echo "Tests completed!"
