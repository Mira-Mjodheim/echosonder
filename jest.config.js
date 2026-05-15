```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'clover'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react|react-dom)/).+\\.js$',
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '\\.db\\.js',
    '\\.config\\.js',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
};