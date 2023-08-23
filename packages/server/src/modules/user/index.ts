import application from '@application';
import { getUser as getUserMiddleware } from './middleware';
import { addUser, getUser as getUserService } from './service';

import './routes';

application.middleware.getUser = getUserMiddleware;
application.service.getUser = getUserService;
application.service.addUser = addUser;

application.register(() => import('./socket'));
