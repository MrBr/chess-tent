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
  SubjectPath,
  updateActivityStepState,
  updateSubjectValueAt,
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
  const [activity, updateActivity] = useState<LessonActivity>(
    createActivity('preview', lesson, user, {
      activeStepId: step.id,
      activeChapterId: chapter.id,
      training: false,
    }),
  );
  const activeStep = getChildStep(
    chapter,
    activity.state.activeStepId || step.id,
  ) as Steps;
  const activityStepState =
    activity.state[step.id] || services.createActivityStepState();
  const stepsCount = useMemo(() => getStepsCount(chapter), [chapter]);
  const currentStepIndex = useMemo(() => getStepIndex(chapter, activeStep), [
    chapter,
    activeStep,
  ]);
  const updateActivityProperty = useCallback(
    (path, value) => {
      updateActivity(updateSubjectValueAt(activity, path, value));
    },
    [activity],
  );
  const updateStepState = useCallback(
    (activity: LessonActivity, stepId: Step['id'], state: {}) =>
      updateActivity(updateActivityStepState(activity, stepId, state)),
    [],
  );
  const updateStepAnalysis = useCallback(
    (
      activity: LessonActivity,
      stepId: Step['id'],
      path: SubjectPath,
      state: {},
    ) =>
      updateActivity(
        updateSubjectValueAt(
          activity,
          ['state', stepId, 'analysis', ...path],
          state,
        ),
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
      updateActivity={updateActivityProperty}
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
