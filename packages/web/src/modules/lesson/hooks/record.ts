import { useEffect } from 'react';
import { hooks } from '@application';
import { Hooks } from '@types';
import { Lesson } from '@chess-tent/models';
import { lesson, lessons, myLessons } from '../record';
import { lessonSelector } from '../state/selectors';

const { useRecordInit, useStore } = hooks;

export const useLessons: Hooks['useLessons'] = (key: string, filters) => {
  const record = useRecordInit(lessons, key);

  useEffect(() => {
    if (record.get().meta.loading) {
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
  const record = useRecordInit(myLessons, 'active-user-lessons');

  useEffect(() => {
    if (record.get().meta.loading) {
      return;
    }
    record.load(filters || {});
    // eslint-disable-next-line
  }, [filters]);

  return record;
};
