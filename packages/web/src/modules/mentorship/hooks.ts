import { useEffect } from 'react';
import { Mentorship, User } from '@chess-tent/models';
import { hooks, requests } from '@application';
import { RecordHookReturn } from '@types';
import { useApi } from '../api/hooks';

const { useRecord } = hooks;

const createUseMentorship = (type: 'coaches' | 'students') => (
  user: User,
): RecordHookReturn<Mentorship[]> => {
  const [mentorship, setMentorship, resetMentorship] = useRecord<Mentorship[]>(
    `${type}-${user.id}`,
  );
  const { fetch, response, loading, error, reset } = useApi(
    type === 'coaches' ? requests.coaches : requests.students,
  );
  useEffect(() => {
    if (!response || mentorship) {
      return;
    }
    setMentorship(response.data);
  }, [reset, response, setMentorship, mentorship]);
  useEffect(() => {
    if (loading || response || error || mentorship) {
      return;
    }
    fetch(user);
  }, [fetch, loading, response, error, mentorship, user]);
  return [mentorship, setMentorship, resetMentorship];
};

const useCoaches = createUseMentorship('coaches');
const useStudents = createUseMentorship('students');

export { useCoaches, useStudents };
