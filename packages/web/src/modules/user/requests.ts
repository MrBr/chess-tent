import { services, requests } from '@application';
import { User } from '@chess-tent/models';
import { StatusResponse, UserResponse } from '@types';

const register = services.createRequest<Partial<User>, StatusResponse>(
  '/register',
  'POST',
);

const login = services.createRequest<
  Pick<User, 'email' | 'password'>,
  UserResponse
>('/login', 'POST');

const me = services.createRequest<User, UserResponse>('/me', 'GET');

requests.register = register;
requests.login = login;
requests.me = me;
