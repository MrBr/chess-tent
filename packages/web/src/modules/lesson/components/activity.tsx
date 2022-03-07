import React, { useCallback, useEffect } from 'react';
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
  LessonActivity,
  markStepCompleted,
  Step,
  updateActivityActiveChapter,
  updateActivityStepState,
  updateAnalysisActiveStepId,
  updateAnalysisStep,
  applyNestedPatches,
  getLessonActivityBoardState,
  TYPE_ACTIVITY,
} from '@chess-tent/models';
import Footer from './activity-footer';
import Header from './activity-header';
import Stepper from './activity-stepper';
import Comments from './activity-comments';
import UserAvatar from '../../user/components/user-avatar';

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
const {
  useDiffUpdates,
  useApi,
  useDispatchService,
  useSocketRoomUsers,
} = hooks;
const { Button, Absolute } = ui;
const { updateLessonActivityActiveStep } = services;

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
      activeBoard:
        props.activity.state.presentedBoardId ||
        props.activity.state.mainBoard.id,
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
    const { updateActivity, activity, step, boardState } = this.props;
    updateActivity(updateActivityStepState)(activity, boardState, step, {
      mode,
    });
  };

  setStepActivityState = (state: {}) => {
    const { activity, step, updateActivity, boardState } = this.props;

    updateActivity(updateActivityStepState)(activity, boardState, step, state);
  };

  updateStepActivityAnalysis = <T extends any[], U>(
    service: (...args: T) => U,
  ) => (...args: T) => {
    const { updateActivity, activity, step, boardState } = this.props;
    updateActivity(applyNestedPatches(service)(...args))(
      activity,
      draft =>
        getLessonActivityBoardState(draft, boardState.id)[step.id].analysis,
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
    const { step } = this.props;
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
      orientation: step.state.orientation,
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
    const { activity, updateActivity, boardState } = this.props;
    updateActivity(markStepCompleted)(activity, boardState, step);
  };

  chapterChangeHandler = (chapter: Chapter) => {
    const { updateActivity, activity, boardState } = this.props;
    updateActivity(updateActivityActiveChapter)(activity, boardState, chapter);
  };

  updateActiveStep = (step: AppStep) => {
    const { updateActivity, activity, boardState } = this.props;
    updateActivity(updateLessonActivityActiveStep)(
      activity,
      boardState,
      step as Steps,
    );
  };

  nextActivityStep = () => {
    const { updateActivity, chapter, step, activity, boardState } = this.props;
    const nextStep = getNextStep(chapter, step) as Steps;
    nextStep &&
      updateActivity(services.updateLessonActivityActiveStep)(
        activity,
        boardState,
        nextStep,
      );
  };

  prevActivityStep = () => {
    const { updateActivity, chapter, step, activity, boardState } = this.props;
    const prevStep = getPreviousStep(chapter, step) as Steps;
    prevStep &&
      updateActivity(services.updateLessonActivityActiveStep)(
        activity,
        boardState,
        prevStep,
      );
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
    return (
      <Footer
        prev={this.prevActivityStep}
        next={this.nextActivityStep}
        className="mt-5 mb-4"
        {...props}
      />
    );
  };

  renderActivityBoard = (props: ChessboardProps) => {
    const { lesson, step, activityStepState } = this.props;
    return (
      <Chessboard
        onMove={this.startAnalysingPosition}
        allowAllMoves
        orientation={step.state.orientation}
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
    const { activityStepState, chapter, step, boardState } = this.props;

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
              initialPosition={services.getStepPosition(step)}
              initialOrientation={step.state.orientation}
              Chessboard={this.renderAnalysisBoard}
            />
          </>
        );
      case ActivityStepMode.SOLVING:
      default:
        return (
          <StepRenderer
            boardState={boardState}
            step={step}
            stepRoot={chapter}
            activeStep={step}
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
      analysis,
      chapter,
      step,
      activityStepState,
      boardState,
      liveUsers,
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
              boardState={boardState}
              step={step}
              stepRoot={chapter}
              component="ActivitySidebar"
              activeStep={step}
              setActiveStep={() => {}}
              setStepActivityState={this.setStepActivityState}
              stepActivityState={activityStepState}
              nextStep={this.nextActivityStep}
              prevStep={this.prevActivityStep}
              completeStep={this.completeStep}
              Chessboard={this.renderActivityBoard}
              Footer={this.renderFooter}
            />
            <LessonPlaygroundCard>
              <AnalysisSidebar
                analysis={analysis}
                updateAnalysis={this.updateStepActivityAnalysis}
                initialPosition={services.getStepPosition(step)}
                initialOrientation={step.state.orientation}
              />
            </LessonPlaygroundCard>
            <LessonPlaygroundCard>
              <Comments
                addComment={this.addStepComment}
                comments={activityStepState.comments}
              />
            </LessonPlaygroundCard>
            {liveUsers && (
              <LessonPlaygroundCard>
                {liveUsers.map(user => (
                  <UserAvatar user={user} />
                ))}
              </LessonPlaygroundCard>
            )}
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
  const activeBoardState = props.activity.state.mainBoard;
  const activeChapterId =
    activeBoardState.activeChapterId ||
    props.activity.subject.state.chapters[0].id;
  const activeChapter = getLessonChapter(lesson, activeChapterId) as Chapter;
  const activeStepId =
    activeBoardState.activeStepId || activeChapter.state.steps[0].id;
  const activeStep = getChildStep(activeChapter, activeStepId) as Steps;
  const activeStepActivityState = activeBoardState[activeStep.id];
  const liveUsers = useSocketRoomUsers(`${TYPE_ACTIVITY}-${props.activity.id}`);

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
    if (!activeBoardState[activeStepId]) {
      updateActivity(updateActivityStepState)(
        props.activity,
        activeBoardState,
        activeStep,
        services.createActivityStepState(),
      );
    }
  }, [
    activeStepId,
    props.activity,
    updateActivity,
    activeBoardState,
    activeStep,
  ]);

  if (!activeStepActivityState) {
    return null;
  }

  return (
    <ActivityRenderer
      activity={props.activity}
      lesson={lesson}
      analysis={activeStepActivityState.analysis}
      step={activeStep}
      chapter={activeChapter}
      updateActivity={updateActivity}
      activityStepState={activeStepActivityState}
      boardState={activeBoardState}
      liveUsers={liveUsers}
    />
  );
};

export default Activity;
