import React, { useMemo } from 'react';
import {
  Chapter,
  getChildStep,
  getLessonChapter,
  Lesson,
  Step,
  updateStepState,
} from '@chess-tent/models';
import { hooks } from '@application';
import { useCallback, useContext } from 'react';
import { Hooks, Steps } from '@types';
import { editorContext } from '../context';
import TrainingAssign from '../components/training-assign';

export * from './training-hooks';

const { usePrompt, useLocation } = hooks;

export const useUpdateLessonStepState = <T extends Step>(
  updateStep: (step: T) => void,
  step: T,
) => {
  return useCallback(
    (state: Partial<T['state']>) => updateStep(updateStepState(step, state)),
    [step, updateStep],
  );
};

export const useEditor = () => {
  const context = useContext(editorContext);
  if (!context) {
    throw new Error('Component using Editor context not in the Editor scope.');
  }
  return context;
};

export const useLessonParams = (lesson: Lesson) => {
  const location = useLocation();

  const { chapters } = lesson.state;
  const activeChapterId =
    new URLSearchParams(location.search).get('activeChapter') || chapters[0].id;
  const activeChapter = useMemo(
    () => getLessonChapter(lesson, activeChapterId),
    [lesson, activeChapterId],
  ) as Chapter;
  const activeStepId =
    new URLSearchParams(location.search).get('activeStep') ||
    activeChapter.state.steps[0].id;
  const activeStep = useMemo(
    () => getChildStep(activeChapter, activeStepId),
    [activeChapter, activeStepId],
  ) as Steps;

  return {
    activeChapter,
    activeStep,
  };
};

export const useLessonMeta: Hooks['useLessonMeta'] = activity => {
  return hooks.useMeta(`lesson-${activity.id}`);
};

export const usePromptNewTrainingModal = () => {
  return usePrompt(close => <TrainingAssign close={close} />);
};

export const useLessonActivity = () => {};
