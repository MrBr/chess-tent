const sharedConfig = require('../../jest.config.js');

module.exports = {
  ...sharedConfig,
  roots: ['<rootDir>/src/application'],
  setupFilesAfterEnv: ['<rootDir>/src/application/setup.jest.ts'],
};
