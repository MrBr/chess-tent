import application from '@application';

application.register(() => import('./components'));
application.register(() => import('./provider'));
application.register(() => import('./routes'));
application.register(
  () => import('./service/search'),
  module => {
    application.services.registerSearchable = module.register;
  },
);
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

application.constants.APP_URL = `${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_DOMAIN}`;
