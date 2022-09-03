import { hooks } from '@application';
import { User } from '@chess-tent/models';
import { Hooks } from '@types';
import { useSelector } from 'react-redux';

import { userSelector } from './state/selectors';
import { activeUser } from './records';

export const useUser = (userId: User['id']) => {
  return useSelector(userSelector(userId));
};

export const useActiveUserRecord = (fallback => {
  return hooks.useRecordSafe(
    hooks.useRecordInit(activeUser, 'activeUser'),
    fallback,
  );
}) as Hooks['useActiveUserRecord'];
