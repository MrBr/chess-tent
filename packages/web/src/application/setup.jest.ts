import application from '@application';
import { Crypto } from '@peculiar/webcrypto';

import '../modules';

// required for ZoomSdk
global.crypto = new Crypto();

beforeAll(() => application.init());
