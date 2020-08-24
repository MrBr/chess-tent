import application from '@application';
import { TYPE_ACTIVITY } from '@chess-tent/models';
import { activitySchema } from './model';

application.model.activitySchema = activitySchema;
application.register(
  () => import('./components/activities'),
  module => {
    application.components.Activities = module.default;
  },
);
application.register(
  () => import('./state/reducer'),
  module => {
    application.state.registerEntityReducer(TYPE_ACTIVITY, module.reducer);
  },
);
application.register(
  () => import('./state/actions'),
  module => {
    application.state.actions.updateActivity = module.updateActivityAction;
    application.state.actions.updateActivityState =
      module.updateActivityStateAction;
  },
);
application.register(
  () => import('./state/selectors'),
  module => {
    application.state.selectors.activitySelector = module.activitySelector;
  },
);
application.register(() => import('./requests'));
