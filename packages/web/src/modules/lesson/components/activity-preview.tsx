import React, { useCallback, useMemo, useState } from 'react';
import { components, hooks, ui } from '@application';
import {
  createActivity,
  getLessonNextStep,
  getLessonPreviousStep,
  getLessonStep,
  getLessonStepIndex,
  getLessonStepsCount,
  Lesson,
  markStepCompleted,
  Step,
  updateStepState,
  User,
} from '@chess-tent/models';
import { ActivityFooterProps, LessonActivity } from '@types';
import Footer from './activity-footer';

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
  const activeStep = getLessonStep(lesson, activity.state.activeStepId);
  const activityStepState = activity.state[step.id] || {};
  const stepsCount = useMemo(() => getLessonStepsCount(lesson), [lesson]);
  const currentStepIndex = useMemo(
    () => getLessonStepIndex(lesson, activeStep),
    [lesson, activeStep],
  );

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

  const nextActivityStep = useCallback(() => {
    const nextStep = getLessonNextStep(lesson, activeStep);
    nextStep &&
      updateActivity({
        ...activity,
        state: {
          ...activity.state,
          activeStepId: nextStep.id,
        },
      });
  }, [activity, activeStep, updateActivity, lesson]);
  const prevActivityStep = useCallback(() => {
    const prevStep = getLessonPreviousStep(lesson, activeStep);
    prevStep &&
      updateActivity({
        ...activity,
        state: {
          ...activity.state,
          activeStepId: prevStep.id,
        },
      });
  }, [activity, activeStep, updateActivity, lesson]);

  const completeStep = useCallback(
    (step: Step) => {
      updateActivity({
        ...activity,
        completedSteps: markStepCompleted(activity, step),
      });
    },
    [activity, updateActivity],
  );

  const footerRender = (props: Partial<ActivityFooterProps>) => (
    <Footer
      currentStep={currentStepIndex}
      stepsCount={stepsCount}
      prev={prevActivityStep}
      next={nextActivityStep}
      {...props}
    />
  );

  return (
    <StepRenderer<'Playground'>
      step={activeStep}
      component="Playground"
      activeStep={activeStep}
      lesson={lesson}
      setActiveStep={() => {}}
      setStepActivityState={setStepActivityState}
      stepActivityState={activityStepState}
      nextStep={() => {}}
      prevStep={() => {}}
      Chessboard={Chessboard}
      activity={activity}
      completeStep={completeStep}
      Footer={footerRender}
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
