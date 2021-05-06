import application from '@application';

application.register(
  () => import('./hooks'),
  module => {
    application.hooks.usePathUpdates = module.usePathUpdates;
    application.hooks.useDiffUpdates = module.useDiffUpdates;
  },
);
