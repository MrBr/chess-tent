import application from '@application';

application.register(
  () => import('./pages/home'),
  module => {
    application.pages.Landing = module.default;
  },
);
