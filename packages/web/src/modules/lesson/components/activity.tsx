import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityComponent,
  ActivityFooterProps,
  ActivityRendererProps,
  ActivityRendererState,
  ActivityStepMode,
  ChessboardProps,
  FEN,
  Move,
  Piece,
  PieceColor,
  PieceRole,
  Steps,
} from '@types';
import { components, hooks, requests, services, ui } from '@application';
import {
  addStep,
  Analysis,
  Chapter,
  getAnalysisActiveStep,
  getChildStep,
  getLessonChapter,
  getNextStep,
  getPreviousStep,
  getStepIndex,
  getStepsCount,
  isLessonPublicDocument,
  LessonActivity,
  markStepCompleted,
  Step,
  updateActivityActiveChapter,
  updateActivityStepAnalysis,
  updateActivityStepState,
  updateAnalysisActiveStepId,
  updateAnalysisStep,
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
const { useDiffUpdates, useApi, useDispatchService } = hooks;
const { Button, Absolute } = ui;

export class ActivityRenderer extends React.Component<
  ActivityRendererProps,
  ActivityRendererState
> {
  constructor(props: Readonly<ActivityRendererProps>) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }

  isAnalysing() {
    const { activityStepState } = this.props;
    return activityStepState.mode === ActivityStepMode.ANALYSING;
  }

  updateStepMode = (mode: ActivityStepMode) => {
    const { updateActivity, activity, activeStep } = this.props;
    updateActivity(updateActivityStepState)(activity, activeStep.id, {
      mode,
    });
  };

  setStepActivityState = (state: {}) => {
    const {
      activity,
      activeStep,
      activityStepState,
      updateActivity,
    } = this.props;

    updateActivity(updateActivityStepState)(activity, activeStep.id, {
      ...activityStepState,
      ...state,
    });
  };

  updateStepActivityAnalysis = (analysis: Analysis<Steps>) => {
    const { updateActivity, activity, activeStep } = this.props;
    !this.isAnalysing() && this.updateStepMode(ActivityStepMode.ANALYSING);
    updateActivity(updateActivityStepAnalysis)(
      activity,
      activeStep.id,
      analysis,
    );
  };

  startAnalysingPosition = (
    position: FEN,
    move: Move,
    piece: Piece,
    captured?: boolean,
    promoted?: PieceRole,
  ) => {
    const { analysis } = this.props.activityStepState;
    const notableMove = services.createNotableMove(
      position,
      move,
      1,
      piece,
      captured,
      promoted,
    );

    const newStep = services.createStep('variation', {
      position: position,
      move: notableMove,
    });

    const newAnalysis = updateAnalysisActiveStepId(
      addStep(analysis, newStep),
      newStep.id,
    );

    this.updateStepActivityAnalysis(newAnalysis);
  };

  completeStep = (step: Step) => {
    const { updateActivity, activity } = this.props;
    updateActivity(markStepCompleted)(activity, step);
  };

  chapterChangeHandler = (chapter: Chapter) => {
    const { updateActivity, activity } = this.props;
    updateActivity(updateActivityActiveChapter)(activity, chapter);
  };

  nextActivityStep = () => {
    const { updateActivity, chapter, activeStep, activity } = this.props;
    const nextStep = getNextStep(chapter, activeStep) as Steps;
    nextStep &&
      updateActivity(services.updateActivityActiveStep)(activity, nextStep);
  };

  prevActivityStep = () => {
    const { updateActivity, chapter, activeStep, activity } = this.props;
    const prevStep = getPreviousStep(chapter, activeStep) as Steps;
    prevStep &&
      updateActivity(services.updateActivityActiveStep)(activity, prevStep);
  };

  updateStepRotation = (orientation?: PieceColor) => {
    const { analysis } = this.props;
    const step = getAnalysisActiveStep(analysis);
    const updatedStep = services.updateStepRotation(step, orientation);
    const newAnalysis = updateAnalysisStep(analysis, updatedStep);
    this.updateStepActivityAnalysis(newAnalysis);
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

  renderActivityBoard = (props: ChessboardProps) => {
    const { lesson, activeStep } = this.props;
    return (
      <Chessboard
        onMove={this.startAnalysingPosition}
        allowAllMoves
        orientation={activeStep.state.orientation}
        footer={this.renderFooter({})}
        {...props}
        header={<Header lesson={lesson} />}
      />
    );
  };

  renderAnalysisBoard = (props: ChessboardProps) => {
    const { lesson, analysis } = this.props;
    const step = getAnalysisActiveStep(analysis);
    return (
      <Chessboard
        allowAllMoves
        orientation={step && services.getStepBoardOrientation(step)}
        onOrientationChange={this.updateStepRotation}
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
        updateStepMode={this.updateStepMode}
        updateActivityStepState={this.setStepActivityState}
        activeStepActivityState={activityStepState}
        comments={!isLessonPublicDocument(activity.subject)}
        header={
          <LessonChapters
            chapters={lesson.state.chapters}
            activeChapter={chapter}
            onChange={this.chapterChangeHandler}
          />
        }
        tabs={[
          {
            mode: ActivityStepMode.SOLVING,
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
                nextStep={this.nextActivityStep}
                prevStep={this.prevActivityStep}
                activity={activity}
                completeStep={this.completeStep}
                Chessboard={this.renderActivityBoard}
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
                nextStep={this.nextActivityStep}
                prevStep={this.prevActivityStep}
                activity={activity}
                completeStep={this.completeStep}
                Chessboard={this.renderActivityBoard}
                Footer={this.renderFooter}
              />
            ),
          },
          {
            mode: ActivityStepMode.ANALYSING,
            title: 'Analysis',
            board: (
              <>
                <Absolute right={25} top={25}>
                  <Button
                    variant="regular"
                    size="extra-small"
                    onClick={() =>
                      this.updateStepMode(ActivityStepMode.SOLVING)
                    }
                  >
                    Stop analysing
                  </Button>
                </Absolute>
                <AnalysisBoard
                  analysis={analysis}
                  updateAnalysis={this.updateStepActivityAnalysis}
                  initialPosition={services.getStepPosition(activeStep)}
                  initialOrientation={activeStep.state.orientation}
                  Chessboard={this.renderAnalysisBoard}
                />
              </>
            ),
            sidebar: (
              <AnalysisSidebar
                analysis={analysis}
                updateAnalysis={this.updateStepActivityAnalysis}
                initialPosition={services.getStepPosition(activeStep)}
              />
            ),
          },
        ]}
      />
    );
  }
}

const Activity: ActivityComponent<LessonActivity> = props => {
  const lesson = props.activity.subject;
  const activeChapterId =
    props.activity.state.activeChapterId ||
    props.activity.subject.state.chapters[0].id;
  const activeChapter = getLessonChapter(lesson, activeChapterId) as Chapter;
  const activeStepId =
    props.activity.state.activeStepId || activeChapter.state.steps[0].id;
  const activeStep = getChildStep(activeChapter, activeStepId) as Steps;
  const activeStepActivityState = props.activity.state[activeStep.id];

  const dispatchService = useDispatchService();
  const { fetch: saveActivity } = useApi(requests.activityUpdate);
  useDiffUpdates(
    props.activity,
    updates => {
      saveActivity(props.activity.id, updates);
    },
    2000,
  );

  const updateActivity = useCallback(dispatchService, [dispatchService]);

  useEffect(() => {
    if (!props.activity.state[activeStepId]) {
      updateActivity(updateActivityStepState)(
        props.activity,
        activeStepId,
        services.createActivityStepState(),
      );
    }
  }, [activeStepId, props.activity, updateActivity]);

  const stepsCount = useMemo(() => getStepsCount(activeChapter), [
    activeChapter,
  ]);
  const currentStepIndex = useMemo(
    () => getStepIndex(activeChapter, activeStep),
    [activeChapter, activeStep],
  );

  if (!activeStepActivityState) {
    return null;
  }

  return (
    <ActivityRenderer
      activity={props.activity}
      lesson={lesson}
      analysis={activeStepActivityState.analysis}
      activeStep={activeStep}
      chapter={activeChapter}
      updateActivity={updateActivity}
      stepsCount={stepsCount}
      currentStepIndex={currentStepIndex}
      activityStepState={activeStepActivityState}
    />
  );
};

export default Activity;
