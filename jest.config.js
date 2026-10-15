module.exports = {
  testTimeout: 15000,
  projects: [
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/server/**/*.test.js'],
      transform: {},
    },
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/client/FollowButton.test.js', '<rootDir>/tests/client/Feed.test.js'],
      transform: { '\\.[jt]sx?$': 'babel-jest' },
    },
  ],
};
