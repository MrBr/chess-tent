import React, { useCallback, useState } from 'react';
import { components, hooks, ui } from '@application';
import {
  createActivity,
  Lesson,
  Step,
  updateStepState,
  User,
} from '@chess-tent/models';
import { LessonActivity } from '@types';

interface PreviewProps {
  lesson: Lesson;
  step: Step;
}

const { useActiveUserRecord, useComponentState } = hooks;
const { StepRenderer, Chessboard } = components;
const { Modal } = ui;

const Preview = ({ lesson, step }: PreviewProps) => {
  const [user] = useActiveUserRecord() as [User, never, never];
  const [activity, updateActivity] = useState<LessonActivity>(
    createActivity('preview', lesson, user, { activeStepId: step.id }),
  );
  const activityStepState = activity.state[step.id] || {};

  const setStepActivityState = useCallback(
    state => {
      updateActivity({
        ...activity,
        state: {
          ...activity.state,
          [step.id]: updateStepState(activity, step.id, state),
        },
      });
    },
    [step.id, activity, updateActivity],
  );

  return (
    <StepRenderer<'Playground'>
      step={step}
      component="Playground"
      activeStep={step}
      lesson={lesson}
      setActiveStep={() => {}}
      setStepActivityState={setStepActivityState}
      stepActivityState={activityStepState}
      nextStep={() => {}}
      prevStep={() => {}}
      Chessboard={Chessboard}
      activity={activity}
      completeStep={() => {}}
      footer={<></>}
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
    </Modal>
  );
};

export { Preview as default, PreviewModal };
