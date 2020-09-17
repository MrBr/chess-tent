import React, { useCallback, useMemo } from 'react';
import { ActivityComponent, ActivityFooterProps, LessonActivity } from '@types';
import { components, hooks, state } from '@application';
import {
  Chapter,
  getChapterNextStep,
  getChapterPreviousStep,
  getChapterStep,
  getChapterStepIndex,
  getChapterStepsCount,
  getLessonChapter,
  markStepCompleted,
  Step,
  updateStepState,
} from '@chess-tent/models';
import Footer from './activity-footer';

const { StepRenderer, Chessboard } = components;
const { useDispatchBatched, useLocation } = hooks;
const {
  actions: { updateActivityState, setActivityActiveStep, updateActivity },
} = state;

const Activity: ActivityComponent<LessonActivity> = ({ activity }) => {
  const dispatch = useDispatchBatched();
  const lesson = activity.subject;
  const location = useLocation();
  const activeChapterId =
    new URLSearchParams(location.search).get('activeChapter') ||
    activity.subject.state.chapters[0].id;
  const activeChapter = getLessonChapter(lesson, activeChapterId) as Chapter;
  const activeStepId =
    new URLSearchParams(location.search).get('activeStep') ||
    activeChapter.state.steps[0].id;
  const activeStep = getChapterStep(activeChapter, activeStepId);
  const activeStepActivityState = activity.state[activeStep.id] || {};

  const stepsCount = useMemo(() => getChapterStepsCount(activeChapter), [
    activeChapter,
  ]);
  const currentStepIndex = useMemo(
    () => getChapterStepIndex(activeChapter, activeStep),
    [activeChapter, activeStep],
  );

  const setStepActivityState = useCallback(
    state => {
      dispatch(
        updateActivityState(activity, {
          [activeStep.id]: updateStepState(activity, activeStep.id, state),
        }),
      );
    },
    [activity, dispatch, activeStep.id],
  );

  const nextActivityStep = useCallback(() => {
    const nextStep = getChapterNextStep(activeChapter, activeStep);
    nextStep && dispatch(setActivityActiveStep(activity, nextStep));
  }, [activity, activeStep, dispatch, activeChapter]);

  const prevActivityStep = useCallback(() => {
    const prevStep = getChapterPreviousStep(activeChapter, activeStep);
    prevStep && dispatch(setActivityActiveStep(activity, prevStep));
  }, [activity, activeStep, dispatch, activeChapter]);

  const completeStep = useCallback(
    (step: Step) => {
      dispatch(
        updateActivity(activity, {
          completedSteps: markStepCompleted(activity, step),
        }),
      );
    },
    [dispatch, activity],
  );

  const footerRender = (props: Partial<ActivityFooterProps>) => (
    <Footer
      next={nextActivityStep}
      prev={prevActivityStep}
      stepsCount={stepsCount}
      currentStep={currentStepIndex}
      {...props}
    />
  );

  return (
    <StepRenderer<'Playground'>
      step={activeStep}
      chapter={activeChapter}
      component="Playground"
      activeStep={activeStep}
      lesson={lesson}
      setActiveStep={() => {}}
      setStepActivityState={setStepActivityState}
      stepActivityState={activeStepActivityState}
      nextStep={nextActivityStep}
      prevStep={prevActivityStep}
      Chessboard={Chessboard}
      activity={activity}
      completeStep={completeStep}
      Footer={footerRender}
    />
  );
};

export default Activity;
