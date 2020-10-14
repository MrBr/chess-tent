import React, { useCallback, useMemo } from 'react';
import {
  ActivityComponent,
  ActivityFooterProps,
  ChessboardProps,
  LessonActivity,
} from '@types';
import { components, hooks, state, ui } from '@application';
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
  updateActivityStepState,
} from '@chess-tent/models';
import Footer from './activity-footer';

const { StepRenderer, Chessboard } = components;
const { useDispatchBatched, useLocation } = hooks;
const {
  actions: { updateActivityState, setActivityActiveStep, updateActivity },
} = state;
const { Avatar, Headline3, Text } = ui;

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
          [activeStep.id]: updateActivityStepState(
            activity,
            activeStep.id,
            state,
          ),
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

  const boardRender = (props: ChessboardProps) => (
    <Chessboard
      {...props}
      header={
        <>
          <Headline3 className="mt-0">{lesson.state.title}</Headline3>
          <Avatar src={lesson.owner.imageUrl} size="extra-small" />
          <Text inline>{lesson.owner.name}</Text>
        </>
      }
    />
  );

  return (
    <StepRenderer
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
      Chessboard={boardRender}
      activity={activity}
      completeStep={completeStep}
      Footer={footerRender}
    />
  );
};

export default Activity;
