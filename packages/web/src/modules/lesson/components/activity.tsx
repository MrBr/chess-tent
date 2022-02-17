import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityComment,
  ActivityComponent,
  ActivityFooterProps,
  ActivityRendererProps,
  ActivityRendererState,
  ActivityStepMode,
  AppStep,
  ChessboardProps,
  FEN,
  Move,
  Orientation,
  Piece,
  PieceRole,
  Shape,
  Steps,
} from '@types';
import { components, hooks, requests, services, ui } from '@application';
import {
  addStep,
  Chapter,
  getAnalysisActiveStep,
  getChildStep,
  getLessonChapter,
  getNextStep,
  getPreviousStep,
  getStepIndex,
  getStepsCount,
  LessonActivity,
  markStepCompleted,
  Step,
  updateActivityActiveChapter,
  updateActivityStepState,
  updateAnalysisActiveStepId,
  updateAnalysisStep,
  applyNestedPatches,
} from '@chess-tent/models';
import Footer from './activity-footer';
import Header from './activity-header';
import Stepper from './activity-stepper';
import Comments from './activity-comments';

const {
  StepRenderer,
  Chessboard,
  LessonPlayground,
  AnalysisBoard,
  AnalysisSidebar,
  ChessboardContextProvider,
  LessonPlaygroundCard,
  LessonChapters,
} = components;
const { useDiffUpdates, useApi, useDispatchService } = hooks;
const { Button, Absolute } = ui;

export class ActivityRenderer extends React.Component<
  ActivityRendererProps,
  ActivityRendererState
> {
  static defaultProps = {
    comments: true,
  };

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

  /**
   * Function has to be async to "hack" condition race if multiple activity updates
   * are happening in the same time.
   * TODO - there should be clear pattern for stuff like this
   */
  updateStepMode = async (mode: ActivityStepMode) => {
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

  updateStepActivityAnalysis = <T extends any[], U>(
    service: (...args: T) => U,
  ) => (...args: T) => {
    const { updateActivity, activity, activeStep } = this.props;
    updateActivity(applyNestedPatches(service)(...args))(
      activity,
      draft => draft.state[activeStep.id].analysis,
    );
    !this.isAnalysing() && this.updateStepMode(ActivityStepMode.ANALYSING);
  };

  startAnalysingPosition = (
    position: FEN,
    move: Move,
    piece: Piece,
    captured?: boolean,
    promoted?: PieceRole,
  ) => {
    const { activeStep } = this.props;
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
      orientation: activeStep.state.orientation,
      move: notableMove,
    });

    this.updateStepActivityAnalysis(addStep)(analysis, newStep);
    this.updateStepActivityAnalysis(updateAnalysisActiveStepId)(
      analysis,
      newStep.id,
    );
  };

  addStepComment = (comment: ActivityComment) => {
    const { activityStepState } = this.props;
    this.setStepActivityState({
      comments: [...(activityStepState.comments || []), comment],
    });
  };

  completeStep = (step: Step) => {
    const { updateActivity, activity } = this.props;
    updateActivity(markStepCompleted)(activity, step);
  };

  chapterChangeHandler = (chapter: Chapter) => {
    const { updateActivity, activity } = this.props;
    updateActivity(updateActivityActiveChapter)(activity, chapter);
  };

  updateActiveStep = (step: AppStep) => {
    const { updateActivity, activity } = this.props;
    updateActivity(services.updateActivityActiveStep)(activity, step as Steps);
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

  updateStepRotation = (orientation?: Orientation) => {
    const { analysis } = this.props;
    const step = getAnalysisActiveStep(analysis);
    const updatedStep = services.updateStepRotation(step, orientation);
    this.updateStepActivityAnalysis(updateAnalysisStep)(analysis, updatedStep);
  };

  updateStepShapes = (shapes: Shape[]) => {
    this.setStepActivityState({ shapes });
  };

  renderFooter = (props: Partial<ActivityFooterProps>) => {
    const { stepsCount, currentStepIndex } = this.props;
    return (
      <Footer
        currentStep={currentStepIndex}
        stepsCount={stepsCount}
        prev={this.prevActivityStep}
        next={this.nextActivityStep}
        className="mt-5 mb-4"
        {...props}
      />
    );
  };

  renderActivityBoard = (props: ChessboardProps) => {
    const { lesson, activeStep, activityStepState } = this.props;
    return (
      <Chessboard
        onMove={this.startAnalysingPosition}
        allowAllMoves
        orientation={activeStep.state.orientation}
        footer={null}
        onShapesChange={this.updateStepShapes}
        shapes={activityStepState.shapes}
        {...props}
        header={<Header lesson={lesson} />}
      />
    );
  };

  renderAnalysisBoard = (props: ChessboardProps) => {
    const { lesson, analysis, activityStepState } = this.props;
    const step = getAnalysisActiveStep(analysis);

    // Only applicable to the step ActivityBoard components
    if (props.shapes && activityStepState.mode === ActivityStepMode.SOLVING) {
      console.warn('Prop autoShapes should be used in activity.');
    }

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

  renderBoard() {
    const {
      activityStepState,
      chapter,
      activeStep,
      lesson,
      activity,
    } = this.props;
    switch (activityStepState.mode) {
      case ActivityStepMode.ANALYSING:
        return (
          <>
            <Absolute right={25} top={25}>
              <Button
                variant="regular"
                size="extra-small"
                onClick={() => this.updateStepMode(ActivityStepMode.SOLVING)}
              >
                Stop analysing
              </Button>
            </Absolute>
            <AnalysisBoard
              analysis={activityStepState.analysis}
              updateAnalysis={this.updateStepActivityAnalysis}
              initialPosition={services.getStepPosition(activeStep)}
              initialOrientation={activeStep.state.orientation}
              Chessboard={this.renderAnalysisBoard}
            />
          </>
        );
      case ActivityStepMode.SOLVING:
      default:
        return (
          <StepRenderer
            activity={activity}
            lesson={lesson}
            step={activeStep}
            stepRoot={chapter}
            chapter={chapter}
            activeStep={activeStep}
            setActiveStep={() => {}}
            component="ActivityBoard"
            setStepActivityState={this.setStepActivityState}
            stepActivityState={activityStepState}
            nextStep={this.nextActivityStep}
            prevStep={this.prevActivityStep}
            completeStep={this.completeStep}
            Chessboard={this.renderActivityBoard}
            Footer={this.renderFooter}
          />
        );
    }
  }

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
        stepper={<Stepper root={chapter} onStepClick={this.updateActiveStep} />}
        sidebar={
          <>
            <LessonChapters
              chapters={lesson.state.chapters}
              activeChapter={chapter}
              onChange={this.chapterChangeHandler}
            />
            {this.renderFooter({})}
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
            <LessonPlaygroundCard>
              <AnalysisSidebar
                analysis={analysis}
                updateAnalysis={this.updateStepActivityAnalysis}
                initialPosition={services.getStepPosition(activeStep)}
                initialOrientation={activeStep.state.orientation}
              />
            </LessonPlaygroundCard>
            <LessonPlaygroundCard>
              <Comments
                addComment={this.addStepComment}
                comments={activityStepState.comments}
              />
            </LessonPlaygroundCard>
          </>
        }
        board={
          <ChessboardContextProvider>
            {this.renderBoard()}
          </ChessboardContextProvider>
        }
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
