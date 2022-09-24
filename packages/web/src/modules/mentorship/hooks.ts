import { useEffect, useCallback } from 'react';
import { Mentorship } from '@chess-tent/models';
import { hooks, records, requests, state } from '@application';
import { Hooks } from '@types';
import { students, coaches } from './record';

const { useRecordInit, useDispatch, useApi } = hooks;
const {
  actions: { updateEntities },
} = state;
const { isInitialized } = records;

const useCoaches: Hooks['useCoaches'] = () => {
  const record = useRecordInit(coaches, `my-coaches`);

  useEffect(() => {
    if (isInitialized(record)) {
      return;
    }
    record.load();
    // eslint-disable-next-line
  }, []);

  return record;
};

const useStudents: Hooks['useStudents'] = () => {
  const record = useRecordInit(students, `my-students`);

  useEffect(() => {
    if (isInitialized(record)) {
      return;
    }
    record.load();
    // eslint-disable-next-line
  }, []);

  return record;
};

const useMentorship: Hooks['useMentorship'] = (mentorship: Mentorship) => {
  const dispatch = useDispatch();
  const { fetch, loading } = useApi(requests.mentorshipResolve);
  const update = useCallback(
    (approved: boolean) => {
      fetch({
        studentId: mentorship.student.id,
        coachId: mentorship.coach.id,
        approved,
      });
      dispatch(
        updateEntities({
          ...mentorship,
          approved,
        }),
      );
    },
    [fetch, mentorship, dispatch],
  );
  return { update, loading };
};

export { useCoaches, useStudents, useMentorship };
