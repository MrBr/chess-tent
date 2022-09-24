import { services, requests } from '@application';
import { Requests } from '@types';

const register = services.createRequest<Requests['register']>(
  'POST',
  '/register',
);

const inviteUser = services.createRequest<Requests['inviteUser']>(
  'POST',
  '/invite-user',
);

const login = services.createRequest<Requests['login']>('POST', '/login');

const coaches = services.createRequest<Requests['coaches']>(
  'POST',
  '/coaches',
  filters => filters,
);

const logout = services.createRequest<Requests['logout']>('GET', '/logout');

const me = services.createRequest<Requests['me']>('GET', '/me');

const updateMe = services.createRequest<Requests['updateMe']>('PUT', '/me');

const user = services.createRequest<Requests['user']>(
  'GET',
  userId => `/user/${userId}`,
);

const userValidate = services.createRequest<Requests['userValidate']>(
  'POST',
  '/user/validate',
);

requests.register = register;
requests.inviteUser = inviteUser;
requests.login = login;
requests.logout = logout;
requests.me = me;
requests.coaches = coaches;
requests.user = user;
requests.updateMe = updateMe;
requests.userValidate = userValidate;
