# Testing Guide

This document provides information about the testing setup and how to run tests for the Student Hub API.

## Test Structure

- `test/` - Contains all test files and utilities
  - `test-setup.js` - Global test setup and utilities
  - `global-setup.js` - Runs once before all tests
  - `global-teardown.js` - Runs once after all tests
  - `test-helpers.js` - Test helper functions
  - `testUtils.js` - Test utilities
  - `achievement.approval.test.js` - Tests for achievement approval workflow
  - `achievement.integration.test.js` - Integration tests for achievements
  - `setupTestDB.js` - Script to set up test database

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or Docker)
- Docker (optional, for running MongoDB in a container)

## Setting Up the Test Environment

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Up Environment Variables**

   Create a `.env.test` file in the project root with the following variables:

   ```env
   NODE_ENV=test
   PORT=5001
   MONGO_URI_TEST=mongodb://localhost:27017/student_hub_test
   JWT_SECRET=test_jwt_secret
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```

3. **Using Docker (Optional)**

   If you want to use Docker for the test database:

   ```bash
   # Start the test database
   docker-compose -f docker-compose.test.yml up -d
   
   # Stop the test database when done
   docker-compose -f docker-compose.test.yml down
   ```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Files

```bash
# Run achievement approval tests
npm test -- test/achievement.approval.test.js

# Run integration tests
npm test -- test/achievement.integration.test.js
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with a Clean Database

```bash
# Setup test database
npm run test:setup

# Run tests
npm test
```

## Test Utilities

### Creating Test Data

You can use the following utility functions in your tests:

```javascript
// Create a test user
const user = await testUtils.createTestUser({
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'student'
});

// Create a test achievement
const achievement = await testUtils.createTestAchievement({
  title: 'Test Achievement',
  type: 'academic',
  status: 'pending'
}, user._id);

// Get auth headers for authenticated requests
const headers = testUtils.getAuthHeaders(token);
```

## Writing Tests

When writing new tests, follow these guidelines:

1. **Test Structure**
   - Use `describe` blocks to group related tests
   - Use `beforeEach` and `afterEach` for test setup/teardown
   - Use meaningful test descriptions

2. **Test Data**
   - Always clean up test data after each test
   - Use factory functions to create test data
   - Keep test data isolated between tests

3. **Assertions**
   - Test both success and error cases
   - Verify response status codes
   - Check response body structure and content
   - Test edge cases and error conditions

## Debugging Tests

To debug tests, you can use the following approaches:

1. **Debug with Chrome DevTools**

   Add `--inspect-brk` to your test command:

   ```bash
   node --inspect-brk ./node_modules/.bin/jest --runInBand
   ```

   Then open Chrome and go to `chrome://inspect` to attach the debugger.

2. **Debug with VS Code**

   Add this configuration to your `launch.json`:

   ```json
   {
     "type": "node",
     "request": "launch",
     "name": "Jest Current File",
     "program": "${workspaceFolder}/node_modules/.bin/jest",
     "args": ["${fileBasename}", "--runInBand"],
     "console": "integratedTerminal",
     "internalConsoleOptions": "neverOpen"
   }
   ```

## Continuous Integration

The project includes a GitHub Actions workflow (`.github/workflows/test.yml`) that runs tests on every push to the `main` branch and on pull requests.

## Best Practices

1. **Isolation**
   - Each test should be independent
   - Reset the database state between tests
   - Don't rely on test execution order

2. **Performance**
   - Mock external services
   - Use in-memory databases when possible
   - Avoid unnecessary database operations

3. **Maintainability**
   - Keep tests simple and focused
   - Use helper functions to reduce duplication
   - Document complex test scenarios

4. **Reliability**
   - Make tests deterministic
   - Avoid race conditions
   - Handle asynchronous code properly

## Troubleshooting

### Tests are hanging

- Make sure all database connections are properly closed
- Check for unhandled promises
- Increase the test timeout if needed

### Database connection issues

- Verify MongoDB is running
- Check the connection string in `.env.test`
- Try restarting the MongoDB service

### Random test failures

- Ensure tests are properly isolated
- Check for race conditions
- Make sure all async operations are properly awaited
