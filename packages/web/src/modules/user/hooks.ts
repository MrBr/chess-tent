import { services } from '@application';
import { User } from '@chess-tent/models';
import { useSelector } from 'react-redux';
import { userSelector } from './state/selectors';

export const useUser = (userId: User['id']) => {
  return useSelector(userSelector(userId));
};

export const useActiveUserRecord = services.createRecordHook<User>(
  'activeUser',
);
