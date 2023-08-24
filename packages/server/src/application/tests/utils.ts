import application from '@application';
import { TYPE_USER, User } from '@chess-tent/models';
import { v4 as uuid } from 'uuid';

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

export const generateCoach = (): User => {
  const id = uuid();
  const suffix = id.substring(0, 6);
  const user: User = {
    id: id,
    nickname: `coach-${suffix}`,
    name: 'Coachy McCoachFace',
    email: `coach1@chesstent+${suffix}.com`,
    type: TYPE_USER,
    active: true,
    coach: true,
    password: 'testpassword1',
  } as User;

  seedUser(user);
  return user;
};

export const generateApiToken = (user: User): String =>
  application.service.generateApiToken(user);
