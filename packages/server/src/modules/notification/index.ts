import application from '@application';
import {
  createNotification,
  sendNotification,
  updateNotifications,
} from './middleware';

import './routes';

application.middleware.sendNotification = sendNotification;
application.middleware.createNotification = createNotification;
application.middleware.updateNotifications = updateNotifications;
