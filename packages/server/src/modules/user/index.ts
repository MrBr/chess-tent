import application from '@application';
import { getUser as getUserMiddleware } from './middleware';
import {
  addUser as addUserService,
  getUser as getUserService,
} from './service';

import './routes';

application.middleware.getUser = getUserMiddleware;
application.service.getUser = getUserService;
application.service.addUser = addUserService;

application.register(() => import('./socket'));
