import { useEffect } from 'react';
import { hooks, records } from '@application';
import { Hooks } from '@types';
import { Lesson } from '@chess-tent/models';
import { lesson, lessons, myLessons } from '../record';
import { RECORD_ACTIVE_USER_LESSONS_KEY } from '../constants';

const { useRecordInit } = hooks;
const { isInitialized } = records;

export const useLessons: Hooks['useLessons'] = (key: string, filters) => {
  const record = useRecordInit(lessons, key);

  useEffect(() => {
    if (isInitialized(record)) {
      return;
    }
    record.load(filters || {});
    // eslint-disable-next-line
  }, [filters]);

  return record;
};

export const useLesson: Hooks['useLesson'] = (lessonId: Lesson['id']) => {
  const record = useRecordInit(lesson, 'lesson' + lessonId);

  useEffect(() => {
    // Can't be really cached as some normalized data is partial
    // Maybe with data chunks
    record.load(lessonId);
    // eslint-disable-next-line
  }, [lessonId]);

  return record;
};

export const useMyLessons: Hooks['useMyLessons'] = filters => {
  const record = useRecordInit(myLessons, RECORD_ACTIVE_USER_LESSONS_KEY);

  useEffect(() => {
    if (isInitialized(record)) {
      return;
    }
    record.load(filters || {});
    // eslint-disable-next-line
  }, [filters]);

  return record;
};
