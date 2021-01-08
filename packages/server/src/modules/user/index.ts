import application from '@application';
import { getUser } from './middleware';

import './routes';

application.middleware.getUser = getUser;

application.register(() => import('./socket'));
