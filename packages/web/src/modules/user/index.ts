import application from '@application';
import { userSchema } from './model';

import './register';

import Register from './pages/register';
import { useActiveUser, useUser } from './hooks';

application.register(() => import('./provider'));
application.register(() => import('./routes'));
application.register(() => import('./requests'));
application.model.userSchema = userSchema;
application.pages.Register = Register;
application.hooks.useUser = useUser;
application.hooks.useActiveUser = useActiveUser;
