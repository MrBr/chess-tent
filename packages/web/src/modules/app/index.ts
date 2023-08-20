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
application.register(
  () => import('./test-environment'),
  module => {
    application.registerInTestEnvironment = module.default;
  },
);

application.constants.APP_URL = process.env.REACT_APP_URL as string;
application.constants.ToS_PATH = '/terms-of-services.txt';
application.constants.PP_PATH = '/privacy-policy.txt';
application.utils.getAppUrl = (path?: string) =>
  `${application.constants.APP_URL}${path}`;
