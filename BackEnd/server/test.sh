#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load environment variables
export NODE_ENV=test

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Docker is not running. Please start Docker and try again.${NC}"
  exit 1
fi

# Start test database
echo -e "${GREEN}Starting test database...${NC}"
docker-compose -f docker-compose.test.yml up -d test-mongodb

# Wait for MongoDB to be ready
echo -e "${GREEN}Waiting for MongoDB to be ready...${NC}"
until docker exec test-mongodb mongosh --eval "print('MongoDB is ready')" &>/dev/null; do
    echo -e "${GREEN}Waiting for MongoDB...${NC}"
    sleep 1
done

# Set environment variables for MongoDB
export MONGO_URI_TEST=mongodb://localhost:27017/student_hub_test

# Run database setup
echo -e "${GREEN}Setting up test database...${NC}""
npm run test:setup

# Run tests
echo -e "${GREEN}Running tests...${NC}"

# If arguments are passed, use them as test patterns
if [ $# -gt 0 ]; then
  npm test -- $@
else
  npm test
fi

# Capture the exit code of the test command
TEST_EXIT_CODE=$?

# Stop test database
echo -e "${GREEN}Stopping test database...${NC}"
docker-compose -f docker-compose.test.yml down

# Exit with the test command's exit code
exit $TEST_EXIT_CODE
