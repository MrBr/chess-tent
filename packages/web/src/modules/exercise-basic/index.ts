import application from '@application';

application.register(
  () => import('./stepper'),
  module => {
    application.components.Stepper = module.Stepper;
    application.components.Action = module.Action;
  },
);
application.register(
  () => import('./exercise'),
  module => {
    application.components.Exercise = module.default;
  },
);
