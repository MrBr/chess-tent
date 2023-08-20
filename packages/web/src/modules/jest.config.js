const sharedConfig = require('../../jest.config.js');

module.exports = {
  ...sharedConfig,
  roots: ['<rootDir>/src/modules'],
  setupFilesAfterEnv: [
    '<rootDir>/src/application/env.jest.ts',
    '<rootDir>/src/modules/setup.jest.ts',
  ],
};
