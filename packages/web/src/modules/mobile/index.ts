import application from '@application';

application.register(
  () => import('./components/mobile-root'),
  module => {
    application.components.MobileRoot = module.default;
  },
);
application.register(
  () => import('./components/mobile-portal'),
  module => {
    application.components.MobilePortal = module.default;
  },
);
application.register(
  () => import('./components/mobile-route'),
  module => {
    application.components.MobileRoute = module.default;
  },
);
application.register(
  () => import('./components/mobile-screen'),
  module => {
    application.components.MobileScreen = module.default;
  },
);
application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useIsMobile = module.useIsMobile;
  },
);
application.register(
  () => import('./hoc'),
  module => {
    application.hoc.withMobile = module.withMobile;
  },
);
