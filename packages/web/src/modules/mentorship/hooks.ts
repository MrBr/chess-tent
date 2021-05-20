import { useEffect } from 'react';
import { Mentorship, TYPE_MENTORSHIP, User } from '@chess-tent/models';
import { hooks, requests } from '@application';
import { RecordHookReturn } from '@types';
import { useApi } from '../api/hooks';

const { useRecord } = hooks;

const createUseMentorship = (type: 'coaches' | 'students') => (
  user: User,
): RecordHookReturn<Mentorship[]> => {
  const [
    mentorship,
    setMentorship,
    resetMentorship,
    mentorshipMeta,
  ] = useRecord<Mentorship[]>(`${type}-${user.id}`, TYPE_MENTORSHIP);
  const { fetch, response, loading, error, reset } = useApi(
    type === 'coaches' ? requests.coaches : requests.students,
  );
  useEffect(() => {
    if (!response) {
      return;
    }
    setMentorship(response.data);
  }, [reset, response, setMentorship]);
  useEffect(() => {
    if (loading || response || error) {
      return;
    }
    fetch(user);
  }, [fetch, loading, response, error, user]);
  return [mentorship, setMentorship, resetMentorship, mentorshipMeta];
};

const useCoaches = createUseMentorship('coaches');
const useStudents = createUseMentorship('students');

export { useCoaches, useStudents };
