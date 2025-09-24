import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, cwd = rootDir) {
  log(`Running: ${command}`, colors.yellow);
  try {
    const output = execSync(command, { stdio: 'inherit', cwd });
    return { success: true, output };
  } catch (error) {
    log(`Command failed: ${error.message}`, colors.red);
    return { success: false, error };
  }
}

async function runTests() {
  log('🚀 Starting test environment setup...', colors.green);

  // Check if Docker is running
  log('🔍 Checking if Docker is running...', colors.green);
  const dockerCheck = runCommand('docker info');
  if (!dockerCheck.success) {
    log('❌ Docker is not running. Please start Docker and try again.', colors.red);
    process.exit(1);
  }

  // Start test database
  log('🐳 Starting test database container...', colors.green);
  const dbStart = runCommand('docker-compose -f docker-compose.test.yml up -d test-mongodb');
  if (!dbStart.success) {
    log('❌ Failed to start test database', colors.red);
    process.exit(1);
  }

  // Wait for MongoDB to be ready
  log('⏳ Waiting for MongoDB to be ready...', colors.green);
  const maxAttempts = 30;
  let isMongoReady = false;

  for (let i = 1; i <= maxAttempts; i++) {
    try {
      execSync('docker exec test-mongodb mongosh --eval "print(\'MongoDB is ready\')"', { stdio: 'pipe' });
      isMongoReady = true;
      log('✅ MongoDB is ready!', colors.green);
      break;
    } catch (error) {
      log(`⏳ Waiting for MongoDB... (Attempt ${i}/${maxAttempts})`, colors.yellow);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  if (!isMongoReady) {
    log('❌ MongoDB failed to start within the expected time', colors.red);
    cleanup();
    process.exit(1);
  }

  // Set environment variables
  process.env.NODE_ENV = 'test';
  process.env.MONGO_URI_TEST = 'mongodb://localhost:27017/student_hub_test';

  // Run database setup
  log('🛠️  Setting up test database...', colors.green);
  const setupResult = runCommand('npm run test:setup');
  if (!setupResult.success) {
    log('❌ Failed to set up test database', colors.red);
    cleanup();
    process.exit(1);
  }

  // Run tests
  log('🚀 Running tests...', colors.green);
  const testResult = runCommand('npm test');
  
  // Cleanup
  cleanup();
  
  // Exit with test result code
  process.exit(testResult.success ? 0 : 1);
}

function cleanup() {
  log('🧹 Cleaning up test environment...', colors.green);
  try {
    runCommand('docker-compose -f docker-compose.test.yml down');
  } catch (error) {
    log(`⚠️  Warning: Failed to clean up test environment: ${error.message}`, colors.yellow);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n👋 Test run interrupted by user', colors.yellow);
  cleanup();
  process.exit(0);
});

// Run the tests
runTests().catch(error => {
  log(`❌ An unexpected error occurred: ${error.message}`, colors.red);
  cleanup();
  process.exit(1);
});
