import application from '@application';
import { Crypto } from '@peculiar/webcrypto';

import '../modules';

// required for ZoomSdk
global.crypto = new Crypto();

beforeAll(() => application.init());

console.warn('See jest.config. - TLDR; upgrade to jest 28.0.6 when possible');
// module.exports = async () => application.init();
