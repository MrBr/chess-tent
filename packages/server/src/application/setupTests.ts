import 'dotenv/config';
import application from '@application';

import '../modules';

jest.setTimeout(1000 * 60 * 5);

process.env.TOKEN_SECRET = 'test_secret';
beforeAll(() => application.init());
