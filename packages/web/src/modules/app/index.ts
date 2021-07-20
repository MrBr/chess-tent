import application from '@application';

application.register(() => import('./components'));
application.register(() => import('./provider'));
application.register(() => import('./routes'));
application.register(
  () => import('./pages/home'),
  module => {
    application.pages.Home = module.default;
  },
);
application.register(
  () => import('./record'),
  module => {
    application.records.getRecordInitByNamespace =
      module.getRecordInitByNamespace;
  },
);
application.register(
  () => import('./pages/landing'),
  module => {
    application.pages.Landing = module.default;
  },
);
application.register(
  () => import('./pages/dashboard'),
  module => {
    application.pages.Dashboard = module.default;
  },
);
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
