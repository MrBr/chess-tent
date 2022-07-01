import application from '@application';
import {
  createNotifications,
  sendNotifications,
  updateNotifications,
} from './middleware';

import './routes';

application.middleware.sendNotifications = sendNotifications;
application.middleware.createNotifications = createNotifications;
application.middleware.updateNotifications = updateNotifications;
