import application, {
  stepModules,
  state,
  hooks,
  constants,
  components,
} from '@application';

application.register(
  () => [components.StepRenderer],
  () => {
    application.components.Stepper = require('./stepper').Stepper;
    console.log('App Stepper:', application.components.Stepper);
    application.components.Action = require('./stepper').Action;
  },
);

application.register(
  () => [
    stepModules.createStep,
    stepModules.getStepEndSetup,
    components.Stepper,
    components.StepRenderer,
    state.selectors?.exerciseSelector,
    state.actions?.setExerciseActiveStep,
    state.actions?.updateEntities,
    state.actions?.addSectionChild,
    hooks.useDispatchBatched,
    constants.START_FEN,
  ],
  () => {
    application.components.Exercise = require('./exercise').default;
  },
);
