module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts)', '**/?(*.)+(spec|test).+(ts)'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  // moduleNameMapper: {
  //   '@application/(.*)': '<rootDir>/src/application/$1',
  // },
};
