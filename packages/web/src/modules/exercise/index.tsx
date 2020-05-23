import application from '@application';
import { setExerciseActiveStepAction } from './state/actions';

application.register(() => import('./register'));

application.state.actions.setExerciseActiveStep = setExerciseActiveStepAction;

application.register(
  () => import('./model'),
  module => {
    application.model.exerciseSchema = module.exerciseSchema;
  },
);

application.register(
  () => import('./state/selectors'),
  module => {
    application.state.selectors.exerciseSelector = module.exerciseSelector;
  },
);
