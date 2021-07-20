import { useEffect } from 'react';
import { User } from '@chess-tent/models';
import { hooks } from '@application';
import { Hooks } from '@types';
import { students, coaches } from './record';

const { useRecordInit } = hooks;

const useCoaches: Hooks['useCoaches'] = (user: User) => {
  const record = useRecordInit(coaches, `coaches-${user.id}`);

  useEffect(() => {
    record.load(user);
    // eslint-disable-next-line
  }, []);

  return record;
};

const useStudents: Hooks['useStudents'] = (user: User) => {
  const record = useRecordInit(students, `students-${user.id}`);

  useEffect(() => {
    record.load(user);
    // eslint-disable-next-line
  }, []);

  return record;
};

export { useCoaches, useStudents };
