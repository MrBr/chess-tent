import application from '@application';

import { userSchema } from './model';

import Register from './pages/register';

application.register(
  () => import('./records'),
  module => {
    application.records.activeUser = module.activeUser;
  },
);
application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useUser = module.useUser;
    application.hooks.useActiveUserRecord = module.useActiveUserRecord;
  },
);
application.register(() => import('./provider'));
application.register(() => import('./routes'));
application.register(() => import('./requests'));
application.register(() => import('./state/reducer'));
application.register(
  () => import('./components/coaches'),
  module => {
    application.components.Coaches = module.default;
  },
);
application.register(
  () => import('./components/coach-card'),
  module => {
    application.components.CoachCard = module.default;
  },
);
application.register(
  () => import('./components/user-avatar'),
  module => {
    application.components.UserAvatar = module.default;
  },
);
application.register(
  () => import('./components/user-settings'),
  module => {
    application.components.UserSettings = module.default;
  },
);

application.register(
  () => import('./components/invitation'),
  module => {
    application.components.Invitation = module.default;
  },
);

application.model.userSchema = userSchema;
application.pages.Register = Register;
