import application from '@application';

application.register(
  () => import('./step'),
  module => {
    application.stepModules.registerStep(module.default);
  },
);
