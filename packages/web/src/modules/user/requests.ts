import { services, requests } from '@application';
import { User } from '@chess-tent/models';
import { StatusResponse } from '@types';

const register = services.createRequest<Partial<User>, StatusResponse>(
  '/register',
  'POST',
);

requests.register = register;
