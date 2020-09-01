import { services, requests } from '@application';
import { User } from '@chess-tent/models';
import { StatusResponse, UserResponse } from '@types';

const register = services.createRequest<Partial<User>, StatusResponse>(
  'POST',
  '/register',
);

const login = services.createRequest<
  Pick<User, 'email' | 'password'>,
  UserResponse
>('POST', '/login');

const me = services.createRequest<undefined, UserResponse>('GET', '/me');

const updateMe = services.createRequest<Partial<User>, UserResponse>(
  'PUT',
  '/me',
);

requests.register = register;
requests.login = login;
requests.me = me;
requests.updateMe = updateMe;
