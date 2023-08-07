import crypto from 'crypto';

import '../modules';

// required for ZoomSdk
Object.defineProperty(global.self, 'crypto', {
  value: crypto.webcrypto,
});
