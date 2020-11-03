import React, { useCallback, useMemo } from 'react';
import {
  ActivityComponent,
  ActivityFooterProps,
  ActivityRendererProps,
  ChessboardProps,
  FEN,
  LessonActivity,
  Move,
  Piece,
  PieceRole,
  Steps,
} from '@types';
import { components, hooks, services, state } from '@application';
import {
  Chapter,
  getNextStep,
  getPreviousStep,
  getChildStep,
  getStepIndex,
  getStepsCount,
  getLessonChapter,
  markStepCompleted,
  Step,
  updateActivityStepState,
  Analysis,
  addStep,
} from '@chess-tent/models';
import Footer from './activity-footer';
import Header from './activity-header';

const {
  StepRenderer,
  Chessboard,
  LessonPlayground,
  AnalysisBoard,
  AnalysisSidebar,
  LessonChapters,
} = components;
const { useDispatchBatched, useLocation } = hooks;
const {
  actions: { updateActivity: updateActivityAction },
} = state;

export class ActivityRenderer extends React.Component<ActivityRendererProps> {
  setStepActivityState = (state: {}) => {
    const { updateActivityStepState, activity, activeStep } = this.props;
    updateActivityStepState(activity, activeStep, state);
  };

  setStepActivityAnalysisState = (analysis: Analysis) => {
    this.setStepActivityState({
      analysis,
    });
  };

  startAnalysingPosition = (
    position: FEN,
    move: Move,
    piece: Piece,
    captured?: boolean,
    promoted?: PieceRole,
  ) => {
    const { analysis } = this.props;
    const notableMove = services.createNotableMove(
      position,
      move,
      1,
      piece,
      captured,
      promoted,
    );

    this.setStepActivityAnalysisState(
      addStep(
        analysis,
        services.createStep('variation', {
          position: position,
          move: notableMove,
        }),
      ),
    );
  };

  completeStep = (step: Step) => {
    const { updateActivity, activity } = this.props;
    updateActivity({
      ...activity,
      completedSteps: markStepCompleted(activity, step),
    });
  };

  nextActivityStep = () => {
    const { activity, updateActivity, chapter, activeStep } = this.props;
    const nextStep = getNextStep(chapter, activeStep);
    nextStep &&
      updateActivity({
        ...activity,
        state: {
          ...activity.state,
          activeStepId: nextStep.id,
        },
      });
  };
  prevActivityStep = () => {
    const { activity, updateActivity, chapter, activeStep } = this.props;
    const prevStep = getPreviousStep(chapter, activeStep);
    prevStep &&
      updateActivity({
        ...activity,
        state: {
          ...activity.state,
          activeStepId: prevStep.id,
        },
      });
  };
  renderFooter = (props: Partial<ActivityFooterProps>) => {
    const { stepsCount, currentStepIndex } = this.props;
    return (
      <Footer
        currentStep={currentStepIndex}
        stepsCount={stepsCount}
        prev={this.prevActivityStep}
        next={this.nextActivityStep}
        {...props}
      />
    );
  };
  renderBoard = (props: ChessboardProps) => {
    const { lesson } = this.props;
    return (
      <Chessboard
        onMove={this.startAnalysingPosition}
        edit
        {...props}
        header={<Header lesson={lesson} />}
      />
    );
  };

  render() {
    const {
      lesson,
      activity,
      analysis,
      chapter,
      activeStep,
      activityStepState,
    } = this.props;
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
                setStepActivityState={this.setStepActivityState}
                stepActivityState={activityStepState}
                nextStep={() => {}}
                prevStep={() => {}}
                activity={activity}
                completeStep={this.completeStep}
                Chessboard={this.renderBoard}
                Footer={this.renderFooter}
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
                setStepActivityState={this.setStepActivityState}
                stepActivityState={activityStepState}
                nextStep={() => {}}
                prevStep={() => {}}
                activity={activity}
                completeStep={this.completeStep}
                Chessboard={this.renderBoard}
                Footer={this.renderFooter}
              />
            ),
          },
          {
            title: 'Analysis',
            board: (
              <AnalysisBoard
                analysis={analysis}
                updateAnalysis={this.setStepActivityAnalysisState}
                Chessboard={this.renderBoard}
              />
            ),
            sidebar: (
              <AnalysisSidebar
                analysis={analysis}
                updateAnalysis={this.setStepActivityAnalysisState}
              />
            ),
          },
        ]}
      />
    );
  }
}

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
  const activeStep = getChildStep(activeChapter, activeStepId) as Steps;
  const activeStepActivityState = activity.state[activeStep.id] || {};

  const stepsCount = useMemo(() => getStepsCount(activeChapter), [
    activeChapter,
  ]);
  const currentStepIndex = useMemo(
    () => getStepIndex(activeChapter, activeStep),
    [activeChapter, activeStep],
  );

  const updateActivity = useCallback(
    (activity: LessonActivity) => {
      // TODO - implement logic similar to the lessonUpdates to reduce request payload
      dispatch(updateActivityAction(activity, activity));
    },
    [dispatch],
  );
  const updateStepActivityState = useCallback(
    (activity: LessonActivity, step: Step, state: {}) => {
      updateActivity(updateActivityStepState(activity, step.id, state));
    },
    [updateActivity],
  );

  return (
    <ActivityRenderer
      activity={activity}
      lesson={lesson}
      analysis={{} as Analysis}
      activeStep={activeStep}
      chapter={activeChapter}
      updateActivity={updateActivity}
      updateActivityStepState={updateStepActivityState}
      stepsCount={stepsCount}
      currentStepIndex={currentStepIndex}
      activityStepState={activeStepActivityState}
    />
  );
};

export default Activity;
