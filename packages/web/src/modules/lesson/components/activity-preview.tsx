import React, { useCallback, useMemo, useState } from 'react';
import { hooks, services, ui } from '@application';
import {
  Chapter,
  createActivity,
  getChildStep,
  getStepIndex,
  getStepsCount,
  Lesson,
  Step,
  LessonActivity,
} from '@chess-tent/models';
import { Steps } from '@types';
import { ActivityRenderer } from './activity';

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
    createActivity('preview', lesson, user, {
      activeStepId: step.id,
      activeChapterId: chapter.id,
      training: false,
      [step.id]: services.createActivityStepState(),
    }),
  );
  const activeStep = getChildStep(
    chapter,
    activity.state.activeStepId || step.id,
  ) as Steps;
  const activityStepState = activity.state[activeStep.id];
  const stepsCount = useMemo(() => getStepsCount(chapter), [chapter]);
  const currentStepIndex = useMemo(() => getStepIndex(chapter, activeStep), [
    chapter,
    activeStep,
  ]);
  const updateActivity = useCallback(
    service => (...args: Parameters<typeof service>) => {
      updatePreviewActivity(service(...args));
    },
    [updatePreviewActivity],
  );

  return (
    <ActivityRenderer
      activity={activity}
      lesson={lesson}
      analysis={activityStepState.analysis}
      activeStep={activeStep}
      chapter={chapter}
      updateActivity={updateActivity}
      stepsCount={stepsCount}
      currentStepIndex={currentStepIndex}
      activityStepState={activityStepState}
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
