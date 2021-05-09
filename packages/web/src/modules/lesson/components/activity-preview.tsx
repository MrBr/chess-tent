import React, { useCallback, useMemo, useState } from 'react';
import { hooks, services, ui } from '@application';
import {
  Analysis,
  Chapter,
  createActivity,
  getChildStep,
  getStepIndex,
  getStepsCount,
  Lesson,
  Step,
  updateActivityStepAnalysis,
  updateActivityStepState,
  User,
} from '@chess-tent/models';
import { LessonActivity, Steps } from '@types';
import { ActivityRenderer } from './activity';

interface PreviewProps {
  lesson: Lesson;
  step: Step;
  chapter: Chapter;
}

const { useActiveUserRecord, useComponentState } = hooks;

const { Modal } = ui;

const Preview = ({ lesson, chapter, step }: PreviewProps) => {
  const [user] = useActiveUserRecord() as [User, never, never];
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
  const activityStepState = activity.state[step.id];
  const stepsCount = useMemo(() => getStepsCount(chapter), [chapter]);
  const currentStepIndex = useMemo(() => getStepIndex(chapter, activeStep), [
    chapter,
    activeStep,
  ]);
  const updateStepState = useCallback(
    (activity: LessonActivity, stepId: Step['id'], state: {}) =>
      updatePreviewActivity(updateActivityStepState(activity, stepId, state)),
    [],
  );
  const updateStepAnalysis = useCallback(
    (activity: LessonActivity, stepId: Step['id'], analysis: Analysis<Steps>) =>
      updatePreviewActivity(
        updateActivityStepAnalysis(activity, stepId, analysis),
      ),
    [],
  );

  return (
    <ActivityRenderer
      activity={activity}
      lesson={lesson}
      analysis={activityStepState.analysis}
      activeStep={activeStep}
      chapter={chapter}
      updateActivity={updatePreviewActivity}
      updateActivityStepState={updateStepState}
      updateActivityStepAnalysis={updateStepAnalysis}
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
