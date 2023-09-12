import application from '@application';
import { getUser as getUserMiddleware } from './middleware';
import {
  addUser as addUserService,
  getUser as getUserService,
  getRandomPublicCoaches as getRandomPublicCoachesService,
} from './service';

import './routes';

application.middleware.getUser = getUserMiddleware;
application.service.getUser = getUserService;
application.service.addUser = addUserService;
application.service.getRandomPublicCoaches = getRandomPublicCoachesService;

application.register(() => import('./socket'));
