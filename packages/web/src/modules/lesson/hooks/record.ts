import { useEffect } from 'react';
import { hooks, records } from '@application';
import { Hooks } from '@types';
import { Lesson } from '@chess-tent/models';
import { lesson, lessons, myLessons } from '../record';
import { lessonSelector } from '../state/selectors';
import { RECORD_ACTIVE_USER_LESSONS_KEY } from '../constants';

const { useRecordInit, useStore } = hooks;
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
  const store = useStore();
  const record = useRecordInit(lesson, 'lesson' + lessonId);

  useEffect(() => {
    const state = store.getState();
    const lesson = lessonSelector(lessonId)(state);
    if (record.value) {
      return;
    }
    if (lesson) {
      record.update(lesson);
      return;
    }
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
