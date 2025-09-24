export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/test-setup.js'],
  testTimeout: 30000,
  testMatch: ['**/test/**/*.test.js', '**/__tests__/**/*.test.js'],
  moduleFileExtensions: ['js', 'json', 'node'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(your-esm-dependencies)/)'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/controllers/**/*.js',
    'src/middleware/**/*.js',
    'src/models/**/*.js',
    'src/routes/**/*.js',
    '!src/**/*.spec.js',
    '!src/**/index.js',
    '!src/config/**',
    '!src/tests/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover', 'json', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/tests/',
    '/coverage/',
    '/dist/'
  ],
  verbose: true,
  testURL: 'http://localhost:5000',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/test/test-setup.js'],
  globalSetup: '<rootDir>/test/global-setup.js',
  globalTeardown: '<rootDir>/test/global-teardown.js',
};
