module.exports = {
  rootDir: './',
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*.+(ts)', '**/?(*.)+(spec|test).+(ts)'],
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest',
  },
  moduleNameMapper: {
    '@application': '<rootDir>/src/application/',
    '@types': ['<rootDir>/src/application/types'],
    // Axios is not transpiled for CommonJS
    // This fix it
    '^axios$': require.resolve('axios'),
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  transformIgnorePatterns: ['dist', 'node_modules'],
  setupFilesAfterEnv: ['<rootDir>/src/application/setupTests.ts'],
  // TODO - use once JEST is upgraded in react-scripts
  // Currently, JEST doesn't support a function export which is necessary to await module initialisation
  // Needed version 28.0.6. - https://github.com/facebook/jest/issues/11038#issuecomment-1055159681
  // setupFiles: ['./src/setup.jest.ts'],
};
