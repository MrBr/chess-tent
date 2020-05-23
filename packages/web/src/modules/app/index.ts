import application from '@application';

application.register(
  () => import('./start'),
  module => {
    application.start = module.default;
  },
);

application.register(
  () => import('./App'),
  module => {
    application.components.App = module.default;
  },
);
