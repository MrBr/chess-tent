import React, { useCallback, useMemo, useState } from 'react';
import { components, hooks, services, ui } from '@application';
import {
  addStep,
  Analysis,
  Chapter,
  createActivity,
  getChildStep,
  getNextStep,
  getPreviousStep,
  getStepIndex,
  getStepsCount,
  Lesson,
  markStepCompleted,
  Step,
  updateActivityStepState,
  User,
} from '@chess-tent/models';
import {
  ActivityFooterProps,
  ChessboardProps,
  FEN,
  LessonActivity,
  NotableMove,
  Steps,
} from '@types';
import Footer from './activity-footer';
import Header from './activity-header';

interface PreviewProps {
  lesson: Lesson;
  step: Step;
  chapter: Chapter;
}

const { useActiveUserRecord, useComponentState } = hooks;
const {
  StepRenderer,
  Chessboard,
  LessonPlayground,
  AnalysisBoard,
  AnalysisSidebar,
  LessonChapters,
} = components;
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
  const analysis =
    // TODO - Define activity step state analysis property
    (activityStepState as { analysis: Analysis }).analysis ||
    services.createAnalysis(services.getStepPosition(activeStep));

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

  const setStepActivityAnalysisState = useCallback(
    analysis => {
      setStepActivityState({
        analysis,
      });
    },
    [setStepActivityState],
  );

  const startAnalysingPosition = useCallback(
    (position: FEN, move: NotableMove) => {
      setStepActivityAnalysisState(
        addStep(
          analysis,
          services.createStep('variation', { position: position, move }),
        ),
      );
    },
    [analysis, setStepActivityAnalysisState],
  );

  const nextActivityStep = useCallback(() => {
    const nextStep = getNextStep(chapter, activeStep);
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
    const prevStep = getPreviousStep(chapter, activeStep);
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

  const boardRender = (props: ChessboardProps) => (
    <Chessboard
      onMove={(position, move, piece, captured, promoted) =>
        startAnalysingPosition(
          position,
          services.createNotableMove(
            position,
            move,
            1,
            piece,
            captured,
            promoted,
          ),
        )
      }
      edit
      {...props}
      header={<Header lesson={lesson} />}
    />
  );

  return (
    <LessonPlayground
      header={
        <LessonChapters
          chapters={lesson.state.chapters}
          activeChapter={chapter}
        />
      }
      tabs={[
        {
          title: 'Step',
          board: (
            <StepRenderer
              step={activeStep}
              stepRoot={chapter}
              chapter={chapter}
              component="ActivityBoard"
              activeStep={activeStep}
              lesson={lesson}
              setActiveStep={() => {}}
              setStepActivityState={setStepActivityState}
              stepActivityState={activityStepState}
              nextStep={() => {}}
              prevStep={() => {}}
              Chessboard={boardRender}
              activity={activity}
              completeStep={completeStep}
              Footer={footerRender}
            />
          ),
          sidebar: (
            <StepRenderer
              step={activeStep}
              stepRoot={chapter}
              chapter={chapter}
              component="ActivitySidebar"
              activeStep={activeStep}
              lesson={lesson}
              setActiveStep={() => {}}
              setStepActivityState={setStepActivityState}
              stepActivityState={activityStepState}
              nextStep={() => {}}
              prevStep={() => {}}
              Chessboard={boardRender}
              activity={activity}
              completeStep={completeStep}
              Footer={footerRender}
            />
          ),
        },
        {
          title: 'Analysis',
          board: (
            <AnalysisBoard
              analysis={analysis}
              updateAnalysis={setStepActivityAnalysisState}
              Chessboard={boardRender}
            />
          ),
          sidebar: (
            <AnalysisSidebar
              analysis={analysis}
              updateAnalysis={setStepActivityAnalysisState}
            />
          ),
        },
      ]}
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
