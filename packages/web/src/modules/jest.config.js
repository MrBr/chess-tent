const sharedConfig = require('../../jest.config.js');

module.exports = {
  ...sharedConfig,
  roots: ['<rootDir>/src/modules'],
};
