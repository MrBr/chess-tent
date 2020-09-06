import application from '@application';

import { default as Header } from './header';

application.components.Header = Header;
application.register(
  () => import('./layout'),
  module => {
    application.components.Layout = module.default;
  },
);
