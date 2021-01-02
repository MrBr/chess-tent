import application from '@application';
import { userSchema } from './model';

import './register';

import Register from './pages/register';
import { useActiveUserRecord, useUser } from './state/hooks';

application.register(() => import('./provider'));
application.register(() => import('./routes'));
application.register(() => import('./requests'));
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

application.model.userSchema = userSchema;
application.pages.Register = Register;
application.hooks.useUser = useUser;
application.hooks.useActiveUserRecord = useActiveUserRecord;
