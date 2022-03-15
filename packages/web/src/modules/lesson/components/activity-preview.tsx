import React, { useCallback, useState, useEffect } from 'react';
import { hooks, services, ui } from '@application';
import {
  Chapter,
  getChildStep,
  Lesson,
  Step,
  LessonActivity,
  getLessonChapter,
  updateActivityStepState,
  getLessonActivityUserActiveBoardState,
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
  const activityBoardState = getLessonActivityUserActiveBoardState(
    activity,
    user.id,
  );

  const activeChapter = getLessonChapter(
    lesson,
    activityBoardState.activeChapterId as string,
  );
  const activeStep = getChildStep(
    activeChapter,
    activityBoardState.activeStepId as string,
  ) as Steps;
  const activityStepState = activityBoardState[activeStep.id];

  useEffect(() => {
    if (!activityStepState) {
      const updatedActivity = updateActivityStepState(
        activity,
        activityBoardState,
        activeStep,
        services.createActivityStepState(),
      );
      updatePreviewActivity(updatedActivity);
    }
  }, [activityStepState, activity, activeStep, activityBoardState]);

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
      step={activeStep}
      chapter={activeChapter}
      updateActivity={updateActivity}
      activityStepState={activityStepState}
      comments={false}
      boardState={activityBoardState}
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
