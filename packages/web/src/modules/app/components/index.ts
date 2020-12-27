import application from '@application';

application.register(
  () => import('./tab-bar'),
  module => {
    application.components.TabBar = module.default;
  },
);
application.register(
  () => import('./header'),
  module => {
    application.components.Header = module.default;
  },
);
application.register(
  () => import('./layout'),
  module => {
    application.components.Layout = module.default;
  },
);
application.register(
  () => import('./page'),
  module => {
    application.components.Page = module.default;
  },
);
