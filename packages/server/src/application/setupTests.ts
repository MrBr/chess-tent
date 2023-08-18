import 'dotenv/config';
import application from '@application';

import '../modules';

jest.setTimeout(1000 * 60 * 5);
beforeAll(() => application.init());
