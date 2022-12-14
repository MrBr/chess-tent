import application from '@application';
import { TYPE_ACTIVITY } from '@chess-tent/models';
import { activitySchema } from './model';

application.model.activitySchema = activitySchema;
application.register(() => import('./state/reducer'));
application.register(() => import('./state/middleware'));
application.register(
  () => import('./record'),
  module => {
    application.records.activity = module.activity;
  },
);
application.register(
  () => import('./hook'),
  module => {
    application.hooks.useActivity = module.useActivity;
  },
);
application.register(
  () => import('./service'),
  module => {
    application.services.createActivityComment = module.createActivityComment;
  },
);
application.register(
  () => import('./components/notification'),
  module => {
    application.services.registerNotificationRenderer(TYPE_ACTIVITY, {
      Toast: module.Toast,
      DropdownItem: module.DropdownItem,
    });
  },
);
application.register(() => import('./requests'));
