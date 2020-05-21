import application, { state, model } from '@application';
import { SCHEMA_EXERCISE } from '@chess-tent/models';

import { reducer } from './state/reducer';
import { setExerciseActiveStepAction } from './state/actions';

application.register(
  () => [state.registerEntityReducer],
  () => {
    application.state.registerEntityReducer(SCHEMA_EXERCISE, reducer);
  },
);

application.register(() => {
  application.state.actions.setExerciseActiveStep = setExerciseActiveStepAction;
});

application.register(
  () => [model.sectionSchema, model.stepSchema],
  () => {
    application.model.exerciseSchema = require('./model').exerciseSchema;
    application.state.selectors.exerciseSelector = require('./state/selectors').exerciseSelector;
  },
);
