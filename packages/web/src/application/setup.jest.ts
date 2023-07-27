import application from '@application';
import crypto from 'crypto';
import fetch from 'node-fetch';

import '../modules';

// required for ZoomSdk
Object.defineProperty(global.self, 'crypto', {
  value: crypto.webcrypto,
});

Object.defineProperty(global.self, 'fetch', { value: fetch });

beforeAll(() => application.init());
