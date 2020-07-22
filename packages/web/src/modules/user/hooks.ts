import { User } from '@chess-tent/models';
import { useSelector } from 'react-redux';
import { activeUserSelector, userSelector } from './state/selectors';

export const useUser = (userId: User['id']) => {
  return useSelector(userSelector(userId));
};

export const useActiveUser = () => {
  return useSelector(activeUserSelector());
};
