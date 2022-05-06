import { useMemo } from 'react';
import {
  Chapter,
  getChildStep,
  getLessonChapter,
  Lesson,
  Step,
  updateStepState,
} from '@chess-tent/models';
import { hooks } from '@application';
import { useCallback } from 'react';
import { Hooks, Steps } from '@types';

const { useLocation, useHistory } = hooks;

export const useUpdateLessonStepState = <T extends Step>(
  updateStep: (step: T) => void,
  step: T,
) => {
  return useCallback(
    (state: Partial<T['state']>) => updateStep(updateStepState(step, state)),
    [step, updateStep],
  );
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
  return hooks.useMeta(`lesson-${activity.id}`, {});
};

export const useOpenTemplate: Hooks['useOpenTemplate'] = () => {
  const history = useHistory();

  return useCallback(
    (template: Lesson) => {
      history.push(`/lesson/${template.id}`);
    },
    [history],
  );
};

export const useOpenLesson: Hooks['useOpenLesson'] = () => {
  const history = useHistory();

  return useCallback(
    (lesson: Lesson) => {
      history.push(`/lesson/preview/${lesson.id}`);
    },
    [history],
  );
};
