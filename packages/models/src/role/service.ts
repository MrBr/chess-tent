import { User } from '../user';
import { Role } from './types';

export const createRole =
  <T extends User, R extends string>(role: R) =>
  (user: T): Role<R> => ({
    user,
    role,
  });

export const createRoles = <T extends User | User[], R extends string>(
  users: T,
  role: R,
): Role<R>[] => {
  return Array.isArray(users)
    ? users.map(createRole(role))
    : [createRole(role)(users as User)];
};
