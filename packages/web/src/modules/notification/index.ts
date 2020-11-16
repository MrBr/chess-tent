import application from '@application';
import { notificationSchema } from './model';

application.model.notificationSchema = notificationSchema;
application.register(() => import('./register'));
application.register(
  () => import('./state/actions'),
  module => {
    application.state.actions.updateNotification =
      module.updateNotificationAction;
  },
);
application.register(() => import('./requests'));
