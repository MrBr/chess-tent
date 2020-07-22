import application from '@application';
import { userSchema } from './model';

import './register';
import './routes';

import Register from './pages/register';
import { useActiveUser, useUser } from './hooks';

application.model.userSchema = userSchema;
application.pages.Register = Register;
application.hooks.useUser = useUser;
application.hooks.useActiveUser = useActiveUser;
