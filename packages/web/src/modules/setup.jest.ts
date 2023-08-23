import application from '@application';
import crypto from 'crypto';

import '../modules';

Object.defineProperty(global.self, 'crypto', {
  value: crypto.webcrypto,
});

beforeAll(() => application.init());
