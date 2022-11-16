import application from '@application';
import { getUser as getUserMiddleware } from './middleware';
import { getUser as getUserService } from './service';

import './routes';

application.middleware.getUser = getUserMiddleware;
application.service.getUser = getUserService;

application.register(() => import('./socket'));
