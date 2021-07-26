import { services, requests } from '@application';
import { User } from '@chess-tent/models';
import { RegisterRequestParams, InviteUserParams } from '@chess-tent/types';
import { StatusResponse, UserResponse, UsersResponse } from '@types';

const register = services.createRequest<RegisterRequestParams, UserResponse>(
  'POST',
  '/register',
);

const inviteUser = services.createRequest<InviteUserParams, StatusResponse>(
  'POST',
  '/invite-user',
);

const login = services.createRequest<
  Pick<User, 'email' | 'password'>,
  UserResponse
>('POST', '/login');

const users = services.createRequest<
  { coach?: boolean; name?: string; search?: string },
  UsersResponse
>('POST', '/users');

const logout = services.createRequest<undefined, StatusResponse>(
  'GET',
  '/logout',
);

const me = services.createRequest<undefined, UserResponse>('GET', '/me');

const updateMe = services.createRequest<Partial<User>, UserResponse>(
  'PUT',
  '/me',
);

const user = services.createRequest<User['id'], UserResponse>(
  'GET',
  userId => ({ url: `/user/${userId}` }),
);

requests.register = register;
requests.inviteUser = inviteUser;
requests.login = login;
requests.logout = logout;
requests.me = me;
requests.users = users;
requests.user = user;
requests.updateMe = updateMe;
