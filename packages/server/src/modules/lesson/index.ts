import application from '@application';

import { saveLesson } from './service';
import './routes';

import { lessons } from './tests/fixtures';

application.service.saveLesson = saveLesson;

application.test.fixtures.lessons = lessons;
