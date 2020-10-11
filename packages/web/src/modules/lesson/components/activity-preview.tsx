import React, { useCallback, useMemo, useState } from 'react';
import { components, hooks, ui } from '@application';
import {
  Chapter,
  createActivity,
  getChapterNextStep,
  getChapterPreviousStep,
  getChapterStep,
  getChapterStepIndex,
  getChapterStepsCount,
  Lesson,
  markStepCompleted,
  Step,
  updateActivityStepState,
  User,
} from '@chess-tent/models';
import { ActivityFooterProps, LessonActivity } from '@types';
import Footer from './activity-footer';

interface PreviewProps {
  lesson: Lesson;
  step: Step;
  chapter: Chapter;
}

const { useActiveUserRecord, useComponentState } = hooks;
const { StepRenderer, Chessboard } = components;
const { Modal } = ui;

const Preview = ({ lesson, chapter, step }: PreviewProps) => {
  const [user] = useActiveUserRecord() as [User, never, never];
  const [activity, updateActivity] = useState<LessonActivity>(
    createActivity('preview', lesson, user, {
      activeStepId: step.id,
      activeChapterId: chapter.id,
    }),
  );
  const activeStep = getChapterStep(chapter, activity.state.activeStepId);
  const activityStepState = activity.state[step.id] || {};
  const stepsCount = useMemo(() => getChapterStepsCount(chapter), [chapter]);
  const currentStepIndex = useMemo(
    () => getChapterStepIndex(chapter, activeStep),
    [chapter, activeStep],
  );

  const setStepActivityState = useCallback(
    state => {
      updateActivity({
        ...activity,
        state: {
          ...activity.state,
          [step.id]: updateActivityStepState(activity, step.id, state),
        },
      });
    },
    [step.id, activity, updateActivity],
  );

  const nextActivityStep = useCallback(() => {
    const nextStep = getChapterNextStep(chapter, activeStep);
    nextStep &&
      updateActivity({
        ...activity,
        state: {
          ...activity.state,
          activeStepId: nextStep.id,
        },
      });
  }, [activity, activeStep, updateActivity, chapter]);
  const prevActivityStep = useCallback(() => {
    const prevStep = getChapterPreviousStep(chapter, activeStep);
    prevStep &&
      updateActivity({
        ...activity,
        state: {
          ...activity.state,
          activeStepId: prevStep.id,
        },
      });
  }, [activity, activeStep, updateActivity, chapter]);

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
    <StepRenderer
      step={activeStep}
      chapter={chapter}
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
