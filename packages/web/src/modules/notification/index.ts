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
application.register(
  () => import('./components/stand'),
  module => {
    application.components.NotificationStand = module.default;
  },
);
application.register(() => import('./requests'));
