import { User } from '@chess-tent/models';
import { hooks } from '@application';
import { useEffect, useMemo } from 'react';
import {
  ActivityFilters,
  GetRequestFetchArgs,
  Hooks,
  Records,
  Requests,
} from '@types';
import { userTrainings } from '../record';

const { useRecordInit } = hooks;

export const useUserTrainings: Hooks['useUserTrainings'] = (user: User) => {
  const record = useRecordInit(userTrainings, `trainings-${user.id}`);

  const filters: ActivityFilters = useMemo(
    () => ({
      users: user.id,
    }),
    [user.id],
  );

  useEffect(() => {
    if (record.get().meta.loading) {
      return;
    }
    record.load(filters);
    // eslint-disable-next-line
  }, [filters]);

  return record;
};

export const useUserScheduledTrainings: Hooks['useUserScheduledTrainings'] = (
  user,
  initialFilters,
) => {
  const record = useRecordInit(
    userTrainings as Records['userScheduledTrainings'],
    `scheduled-trainings-${user.id}`,
  );

  const filters: GetRequestFetchArgs<Requests['scheduledTrainings']> = useMemo(
    () => ({
      users: user.id,
      date: { from: new Date() },
      ...initialFilters,
    }),
    // eslint-disable-next-line
    [user.id],
  );

  useEffect(() => {
    if (record.get().meta.loading) {
      return;
    }
    record.load(filters);
    // eslint-disable-next-line
  }, []);

  return record;
};
