import application from '@application';

application.register(
  () => import('./components/step'),
  module => {
    application.stepModules.move = module.default;
  },
);
