import { User } from '../user';
import { Role } from './types';

const createRole = <T extends User, R extends string>(role: R) => (
  user: T,
): Role<R> => ({
  user,
  role,
});

export const createRoles = <T extends User | User[], R extends string>(
  users: T,
  role: R,
): T extends User[] ? Role<R>[] : Role<R> => {
  return (Array.isArray(users)
    ? users.map(createRole(role))
    : createRole(role)(users as User)) as T extends User[]
    ? Role<R>[]
    : Role<R>;
};
