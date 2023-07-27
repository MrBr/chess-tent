import { TYPE_USER, User } from '@chess-tent/models';

const users: User[] = [
  {
    id: '1',
    coach: true,
    nickname: 'coach',
    name: 'Coachy Coach',
    type: TYPE_USER,
    state: {},
  },
  {
    id: '2',
    coach: false,
    nickname: 'student',
    name: 'Study Student',
    type: TYPE_USER,
    state: {},
  },
];

export default users;
