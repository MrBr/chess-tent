import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { hooks, services, ui } from '@application';
import {
  Chapter,
  getChildStep,
  getStepIndex,
  getStepsCount,
  Lesson,
  Step,
  LessonActivity,
  getLessonChapter,
  updateActivityStepState,
  getLessonActivityState,
} from '@chess-tent/models';
import { Steps } from '@types';
import { ActivityRenderer } from './activity';
import { createLessonActivity } from '../service';

interface PreviewProps {
  lesson: Lesson;
  step: Step;
  chapter: Chapter;
}

const { useActiveUserRecord, useComponentState } = hooks;

const { Modal } = ui;

const Preview = ({ lesson, chapter, step }: PreviewProps) => {
  const { value: user } = useActiveUserRecord();
  const [activity, updatePreviewActivity] = useState<LessonActivity>(
    createLessonActivity(lesson, user, {
      activeStepId: step.id,
      activeChapterId: chapter.id,
      [step.id]: services.createActivityStepState(),
    }),
  );
  const activeBoard = activity.state.activeBoard;
  const activityState = getLessonActivityState(activity, activeBoard);

  const activeChapter = getLessonChapter(
    lesson,
    activityState.activeChapterId as string,
  );
  const activeStep = getChildStep(
    activeChapter,
    activityState.activeStepId as string,
  ) as Steps;
  const activityStepState = activityState[activeStep.id];
  const stepsCount = useMemo(() => getStepsCount(activeChapter), [
    activeChapter,
  ]);

  useEffect(() => {
    if (!activityStepState) {
      const updatedActivity = updateActivityStepState(
        activity,
        activeBoard,
        activeStep.id,
        services.createActivityStepState(),
      );
      updatePreviewActivity(updatedActivity);
    }
  }, [activityStepState, activity, activeStep.id, activeBoard]);

  const currentStepIndex = useMemo(
    () => getStepIndex(activeChapter, activeStep),
    [activeChapter, activeStep],
  );

  const updateActivity = useCallback(
    service => (...args: Parameters<typeof service>) => {
      updatePreviewActivity(service(...args));
    },
    [updatePreviewActivity],
  );

  if (!activityStepState) {
    return null;
  }

  return (
    <ActivityRenderer
      activity={activity}
      lesson={lesson}
      analysis={activityStepState.analysis}
      activeStep={activeStep}
      chapter={activeChapter}
      updateActivity={updateActivity}
      stepsCount={stepsCount}
      currentStepIndex={currentStepIndex}
      activityStepState={activityStepState}
      comments={false}
    />
  );
};

const PreviewModal = ({
  close,
  ...props
}: PreviewProps & { close: () => void }) => {
  const { mounted } = useComponentState();
  return (
    <Modal show close={close} fullScreen>
      {mounted && <Preview {...props} />}
    </Modal>
  );
};

export { Preview as default, PreviewModal };
