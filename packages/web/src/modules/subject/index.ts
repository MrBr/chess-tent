import application from '@application';

application.register(
  () => import('./hooks'),
  module => {
    application.hooks.usePathUpdates = module.usePathUpdates;
  },
);
