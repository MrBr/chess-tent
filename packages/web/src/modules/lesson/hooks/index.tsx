import React from 'react';
import { Lesson, Step, updateStepState } from '@chess-tent/models';
import { hooks } from '@application';
import { useCallback, useContext, useEffect } from 'react';
import { Hooks } from '@types';
import { editorContext } from '../context';
import { lessons, myLessons, lesson } from '../record';
import { lessonSelector } from '../state/selectors';
import TrainingAssign from '../components/training-assign';

export * from './training-hooks';

const { useRecordInit, useStore, usePromptModal } = hooks;

export const useUpdateLessonStepState = <T extends Step>(
  updateStep: (step: T) => void,
  step: T,
) => {
  return useCallback(
    (state: Partial<T['state']>) => updateStep(updateStepState(step, state)),
    [step, updateStep],
  );
};

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
    if (lesson) {
      record.update(lesson);
      return;
    }
    record.load(lessonId);
    // eslint-disable-next-line
  }, [lessonId]);

  return record;
};

export const useMyLessons: Hooks['useMyLessons'] = (key: string, filters) => {
  const record = useRecordInit(myLessons, key);

  useEffect(() => {
    if (record.get().meta.loading) {
      return;
    }
    record.load(filters || {});
    // eslint-disable-next-line
  }, [filters]);

  return record;
};

export const useEditor = () => {
  const context = useContext(editorContext);
  if (!context) {
    throw new Error('Component using Editor context not in the Editor scope.');
  }
  return context;
};

export const useLessonMeta: Hooks['useLessonMeta'] = activity => {
  return hooks.useMeta(`lesson-${activity.id}`);
};

export const usePromptNewTrainingModal = () => {
  const promptModal = usePromptModal();
  return useCallback(
    () => promptModal(close => <TrainingAssign close={close} />),
    [promptModal],
  );
};

export const useLessonActivity = () => {};
