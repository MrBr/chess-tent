import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Chapter,
  getChildStep,
  getLessonChapter,
  Lesson,
  Step,
  updateStepState,
} from '@chess-tent/models';
import { hooks } from '@application';
import { Hooks, LessonStatus, LessonUpdates, Requests, Steps } from '@types';
import { RecordValue } from '@chess-tent/redux-record/types';

const {
  useLocation,
  useHistory,
  useApi,
  useDiffUpdates,
  useComponentStateSilent,
} = hooks;

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

export const useLessonPartialUpdates = (
  lesson: RecordValue<Lesson>,
  save: Requests['lessonUpdates'],
) => {
  const { mounted } = useComponentStateSilent();
  const {
    fetch: lessonUpdate,
    error: lessonUpdateError,
    response: lessonUpdateResponse,
    reset: lessonUpdateReset,
  } = useApi(save);
  const [lessonStatus, setLessonStatus] = useState<LessonStatus>(
    lesson ? LessonStatus.INITIAL : LessonStatus.LOADING,
  );

  useDiffUpdates(
    lesson,
    (updates: LessonUpdates) => {
      if (updates.length === 0) {
        setLessonStatus(LessonStatus.SAVED);
        return;
      }
      lessonUpdate((lesson as Lesson).id, updates);
    },
    3000,
  );

  useEffect(() => {
    if (!mounted || !lesson) {
      return;
    }
    setLessonStatus(oldStatus =>
      oldStatus === LessonStatus.LOADING
        ? LessonStatus.INITIAL
        : LessonStatus.DIRTY,
    );
  }, [lesson, mounted]);

  useEffect(() => {
    if (lessonUpdateError && lessonStatus !== LessonStatus.ERROR) {
      setLessonStatus(LessonStatus.ERROR);
    } else if (lessonUpdateResponse && lessonStatus !== LessonStatus.SAVED) {
      setLessonStatus(LessonStatus.SAVED);
    } else if (lessonUpdateResponse || lessonUpdateError) {
      // All saved, clear state for next change
      lessonUpdateReset();
    }
  }, [
    lessonStatus,
    lessonUpdateError,
    lessonUpdateReset,
    lessonUpdateResponse,
  ]);

  return lessonStatus;
};
