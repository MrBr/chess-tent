import application from '@application';

application.register(
  () => import('./components/step'),
  module => {
    application.stepModules.exercise = module.default;
  },
);
