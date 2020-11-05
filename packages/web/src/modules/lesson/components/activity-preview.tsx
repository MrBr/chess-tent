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

const { Modal, Icon, Absolute } = ui;

const Preview = ({ lesson, chapter, step }: PreviewProps) => {
  const [user] = useActiveUserRecord() as [User, never, never];
  const [activity, updateActivity] = useState<LessonActivity>(
    createActivity('preview', lesson, user, {
      activeStepId: step.id,
      activeChapterId: chapter.id,
    }),
  );
  const activeStep = getChildStep(
    chapter,
    activity.state.activeStepId,
  ) as Steps;
  const activityStepState = activity.state[step.id] || {};
  const stepsCount = useMemo(() => getStepsCount(chapter), [chapter]);
  const currentStepIndex = useMemo(() => getStepIndex(chapter, activeStep), [
    chapter,
    activeStep,
  ]);
  const updateStepState = useCallback(
    (activity: LessonActivity, step: Step, state: {}) =>
      updateActivity(updateActivityStepState(activity, step.id, state)),
    [],
  );
  const analysis =
    // TODO - Define activity step state analysis property
    (activityStepState as { analysis: Analysis }).analysis ||
    services.createAnalysis(services.getStepPosition(activeStep));

  return (
    <ActivityRenderer
      activity={activity}
      lesson={lesson}
      analysis={analysis}
      activeStep={activeStep}
      chapter={chapter}
      updateActivity={updateActivity}
      updateActivityStepState={updateStepState}
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
    <Modal show onEscapeKeyDown={close} dialogClassName="full-screen-dialog">
      {mounted && <Preview {...props} />}
      <Absolute left={25} top={15} onClick={close}>
        <Icon type="close" size="large" />
      </Absolute>
    </Modal>
  );
};

export { Preview as default, PreviewModal };
