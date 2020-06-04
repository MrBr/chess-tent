import application from '@application';

import { setLessonActiveStepAction } from './state/actions';
import { lessonSelector } from './state/selectors';

application.register(() => import('./register'));

application.state.actions.setLessonActiveStep = setLessonActiveStepAction;
application.state.selectors.lessonSelector = lessonSelector;

application.register(
  () => import('./model'),
  module => {
    application.model.lessonSchema = module.lessonSchema;
  },
);

application.register(
  () => import('./components/stepper'),
  module => {
    application.components.Stepper = module.Stepper;
    application.components.Action = module.Action;
  },
);
application.register(
  () => import('./components/exercise'),
  module => {
    application.components.Lesson = module.default;
  },
);
