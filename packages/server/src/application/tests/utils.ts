import application from '@application';
import { User } from '@chess-tent/models';

export const jsonHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const seedUser = (user: User) => {
  application.service.addUser(user);
};
