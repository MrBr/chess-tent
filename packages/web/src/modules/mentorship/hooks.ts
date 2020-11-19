import { useEffect } from 'react';
import { Mentorship, User } from '@chess-tent/models';
import { hooks, requests } from '@application';
import { RecordHookReturn } from '@types';
import { useApi } from '../api/hooks';

const { useRecord } = hooks;

const useCoaches = (user: User): RecordHookReturn<Mentorship[]> => {
  const [coaches, setCoaches, resetCoaches] = useRecord<Mentorship[]>(
    `coaches-${user.id}`,
  );
  const { fetch, response, loading, error, reset } = useApi(requests.coaches);
  useEffect(() => {
    if (!response || coaches) {
      return;
    }
    setCoaches(response.data);
  }, [reset, response, setCoaches, coaches]);
  useEffect(() => {
    if (loading || response || error || coaches) {
      return;
    }
    fetch(user);
  }, [fetch, loading, response, error, coaches, user]);
  return [coaches, setCoaches, resetCoaches];
};

export { useCoaches };
