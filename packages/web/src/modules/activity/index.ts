import application from '@application';
import { activitySchema } from './model';

application.model.activitySchema = activitySchema;
application.register(() => import('./register'));
application.register(
  () => import('./state/actions'),
  module => {
    application.state.actions.updateActivityProperty =
      module.updateActivityPropertyAction;
    application.state.actions.updateActivityStepState =
      module.updateActivityStepAction;
    application.state.actions.updateActivityStepAnalysis =
      module.updateActivityStepAnalysisAction;
    application.state.actions.syncActivity = module.syncActivityAction;
  },
);
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
    application.services.createActivityStepState =
      module.createActivityStepState;
    application.services.createActivityComment = module.createActivityComment;
  },
);
application.register(() => import('./requests'));
