import { fixtures } from '@application';
import { TYPE_USER, User } from '@chess-tent/models';

const coach: User = {
  id: '1',
  coach: true,
  nickname: 'coach',
  name: 'Coachy Coach',
  type: TYPE_USER,
  state: {},
};

const student: User = {
  id: '2',
  coach: false,
  nickname: 'student',
  name: 'Study Student',
  type: TYPE_USER,
  state: {},
};

fixtures.users = { coach, student };
