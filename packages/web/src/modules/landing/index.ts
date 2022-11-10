import application from '@application';

application.register(
  () => import('./pages/home'),
  module => {
    application.pages.Landing = module.default;
  },
);
application.register(
  () => import('./pages/about'),
  module => {
    application.pages.About = module.default;
  },
);
application.register(
  () => import('./pages/contact'),
  module => {
    application.pages.Contact = module.default;
  },
);
