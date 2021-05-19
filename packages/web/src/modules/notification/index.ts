import application from '@application';
import { notificationsSchema } from './model';

application.model.notificationsSchema = notificationsSchema;
application.register(() => import('./state/reducer'));
application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useActiveUserNotifications =
      module.useActiveUserNotifications;
  },
);
application.register(
  () => import('./state/middleware'),
  module => {
    application.state.registerMiddleware(module.notificationMiddleware);
  },
);
application.register(
  () => import('./components/stand'),
  module => {
    application.components.NotificationStand = module.default;
  },
);
application.register(
  () => import('./components/render'),
  module => {
    application.components.NotificationRender = module.default;
  },
);
application.register(
  () => import('./components/notifications-modal'),
  module => {
    application.components.NotificationsModal = module.default;
  },
);
application.register(
  () => import('./provider'),
  module => {
    application.services.pushToast = module.pushToast;
    application.services.addProvider(module.ToastProvider);
  },
);
application.register(
  () => import('./model'),
  module => {
    application.services.registerNotificationRenderer =
      module.registerNotificationRenderer;
  },
);
application.register(() => import('./requests'));
