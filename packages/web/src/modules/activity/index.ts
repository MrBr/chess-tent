import application from '@application';
import { TYPE_ACTIVITY } from '@chess-tent/models';
import { activitySchema } from './model';

application.model.activitySchema = activitySchema;
application.register(() => import('./state/reducer'));
application.register(() => import('./state/middleware'));
application.register(
  () => import('./state/selectors'),
  module => {
    application.state.selectors.activitySelector = module.activitySelector;
  },
);
application.register(
  () => import('./service'),
  module => {
    application.services.createActivity = module.createActivity;
    application.services.updateActivityActiveStep =
      module.updateActivityActiveStep;
    application.services.createActivityStepState =
      module.createActivityStepState;
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
