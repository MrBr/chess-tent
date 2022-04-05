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

const users = services.createRequest<Requests['users']>('POST', '/users');

const logout = services.createRequest<Requests['logout']>('GET', '/logout');

const me = services.createRequest<Requests['me']>('GET', '/me');

const updateMe = services.createRequest<Requests['updateMe']>('PUT', '/me');

const user = services.createRequest<Requests['user']>(
  'GET',
  userId => `/user/${userId}`,
);

requests.register = register;
requests.inviteUser = inviteUser;
requests.login = login;
requests.logout = logout;
requests.me = me;
requests.users = users;
requests.user = user;
requests.updateMe = updateMe;
