module.exports = {
  testMatch: ['**/__tests__/**/*.+(ts)', '**/?(*.)+(spec|test).+(ts)'],
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest',
  },
  projects: ['<rootDir>/src/modules', '<rootDir>/src/application'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@application': '<rootDir>/src/application',
    '@types': ['<rootDir>/src/application/types'],
    '\\.(css|less)$': '<rootDir>/test/__mocks__/style-mock.js',
    '^.+\\.svg$': '<rootDir>/test/__mocks__/svg-mock.js',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/__mocks__/file-mock.js',
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(chess.js|redux-record)/)',
    '<rootDir>/node_modules',
  ],
  // TODO - use once JEST is upgraded in react-scripts
  // Currently, JEST doesn't support a function export which is necessary to await module initialisation
  // Needed version 28.0.6. - https://github.com/facebook/jest/issues/11038#issuecomment-1055159681
  // setupFiles: ['./src/setup.jest.ts'],
};
