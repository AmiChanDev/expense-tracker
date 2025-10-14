/** @type {import('jest').Config} */
const config = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest/presets/default-esm',

  // Set the test environment to Node.js
  testEnvironment: 'node',

  // Enable ES modules support
  extensionsToTreatAsEsm: ['.ts'],

  // Module name mapping to handle .js imports in TypeScript files
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Transform node_modules ES modules
  transformIgnorePatterns: [
    'node_modules/(?!(dotenv)/)'
  ],

  // Transform configuration for ts-jest
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'esnext',
          target: 'esnext',
          moduleResolution: 'bundler',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },

  // Test file patterns
  testMatch: [
    '<rootDir>/src/tests/**/*.ts',
    '<rootDir>/src/tests/**/*.test.ts',
    '<rootDir>/src/tests/**/*.spec.ts',
  ],

  // Exclude setup files from being run as tests
  testPathIgnorePatterns: [
    '<rootDir>/src/tests/setup.ts',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/tests/**/*.ts',
    '!src/**/*.d.ts',
  ],

  // Coverage thresholds (optional)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Setup files (if needed for test setup)
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],

  // Timeout for tests (in milliseconds)
  testTimeout: 10000,

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Force exit after tests complete
  forceExit: true,

  // Detect open handles (useful for debugging hanging tests)
  detectOpenHandles: true,
};

module.exports = config;