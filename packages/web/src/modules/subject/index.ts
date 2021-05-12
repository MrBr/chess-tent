import application from '@application';

application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useDiffUpdates = module.useDiffUpdates;
  },
);
