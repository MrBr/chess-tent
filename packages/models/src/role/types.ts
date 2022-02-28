import { User } from '../user';

export interface Role<T> {
  user: User;
  role: T;
}

export interface NormalizedRole<T> {
  user: User['id'];
  role: T;
}
