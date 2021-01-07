import application from '@application';

application.register(
  () => import('./state/reducer'),
  module => {
    application.state.registerReducer('meta', module.default);
  },
);
application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useMeta = module.useMeta;
  },
);
