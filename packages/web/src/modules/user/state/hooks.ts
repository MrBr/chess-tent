import { services } from '@application';
import { TYPE_USER, User } from '@chess-tent/models';
import { useSelector } from 'react-redux';
import { userSelector } from './selectors';

export const useUser = (userId: User['id']) => {
  return useSelector(userSelector(userId));
};

export const useActiveUserRecord = services.createRecordHook<User>(
  'activeUser',
  TYPE_USER,
);
