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
application.model.userSchema = userSchema;
application.pages.Register = Register;
application.hooks.useUser = useUser;
application.hooks.useActiveUserRecord = useActiveUserRecord;
