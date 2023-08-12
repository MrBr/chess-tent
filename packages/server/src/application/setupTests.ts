import 'dotenv/config';
import application from '@application';

import '../modules';

beforeAll(() => application.init());
