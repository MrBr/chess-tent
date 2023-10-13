import 'dotenv/config';
import application from '@application';

import '../modules';

process.env.TOKEN_SECRET = 'test_secret';
beforeAll(() => application.init());
