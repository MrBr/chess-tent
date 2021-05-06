import React, { useCallback, useMemo } from 'react';
import {
  ActivityComponent,
  ActivityFooterProps,
  ActivityRendererProps,
  ActivityRendererState,
  ChessboardProps,
  FEN,
  LessonActivity,
  Move,
  Piece,
  PieceRole,
  Steps,
} from '@types';
import { components, hooks, requests, services, state, ui } from '@application';
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
  SubjectPath,
  TYPE_ACTIVITY,
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
const { useDispatchBatched, usePathUpdates, useApi } = hooks;
const { actions } = state;
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
    const { activeTab } = this.state;
    // TODO - find a better way to render tabs and resolve which tab is active
    return activeTab === 1;
  }

  updateActiveTab = (activeTab: number) => {
    this.setState({ activeTab });
  };

  setStepActivityState = (state: {}) => {
    const {
      updateActivityStepState,
      activity,
      activeStep,
      activityStepState,
    } = this.props;
    updateActivityStepState(activity, activeStep.id, {
      ...activityStepState,
      ...state,
    });
  };

  setStepActivityAnalysisState = (path: SubjectPath, state: any) => {
    const { updateActivityStepAnalysis, activity, activeStep } = this.props;
    !this.isAnalysing() && this.updateActiveTab(1);
    updateActivityStepAnalysis(activity, activeStep.id, path, state);
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

    const newAnalysis = addStep(
      analysis,
      services.createStep('variation', {
        position: position,
        move: notableMove,
      }),
    );

    this.setStepActivityAnalysisState(
      ['state', 'steps'],
      newAnalysis.state.steps,
    );
  };

  completeStep = (step: Step) => {
    const { updateActivity, activity } = this.props;
    updateActivity(['completedSteps'], markStepCompleted(activity, step));
  };

  chapterChangeHandler = (chapter: Chapter) => {
    const { updateActivity } = this.props;
    updateActivity(['state', 'activeChapterId'], chapter.id);
  };

  nextActivityStep = () => {
    const { updateActivity, chapter, activeStep } = this.props;
    const nextStep = getNextStep(chapter, activeStep);
    nextStep && updateActivity(['state', 'activeStepId'], nextStep.id);
  };

  prevActivityStep = () => {
    const { updateActivity, chapter, activeStep } = this.props;
    const prevStep = getPreviousStep(chapter, activeStep);
    prevStep && updateActivity(['state', 'activeStepId'], prevStep.id);
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

  render() {
    const {
      lesson,
      activity,
      analysis,
      chapter,
      activeStep,
      activityStepState,
    } = this.props;
    const { activeTab } = this.state;
    return (
      <LessonPlayground
        activeTab={activeTab}
        setActiveTab={this.updateActiveTab}
        updateActivityStepState={this.setStepActivityState}
        activeStepActivityState={activityStepState}
        header={
          <LessonChapters
            chapters={lesson.state.chapters}
            activeChapter={chapter}
            onChange={this.chapterChangeHandler}
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
                nextStep={this.nextActivityStep}
                prevStep={this.prevActivityStep}
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
                nextStep={this.nextActivityStep}
                prevStep={this.prevActivityStep}
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
              <>
                <Absolute right={25} top={25}>
                  <Button
                    variant="regular"
                    size="extra-small"
                    onClick={() => this.updateActiveTab(0)}
                  >
                    Stop analysing
                  </Button>
                </Absolute>
                <AnalysisBoard
                  analysis={analysis}
                  updateAnalysis={this.setStepActivityAnalysisState}
                  initialPosition={services.getStepPosition(activeStep)}
                  startAnalysingPosition={this.startAnalysingPosition}
                  Chessboard={this.renderBoard}
                />
              </>
            ),
            sidebar: (
              <AnalysisSidebar
                analysis={analysis}
                updateAnalysis={this.setStepActivityAnalysisState}
                initialPosition={services.getStepPosition(activeStep)}
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
  const activeChapterId =
    activity.state.activeChapterId || activity.subject.state.chapters[0].id;
  const activeChapter = getLessonChapter(lesson, activeChapterId) as Chapter;
  const activeStepId =
    activity.state.activeStepId || activeChapter.state.steps[0].id;
  const activeStep = getChildStep(activeChapter, activeStepId) as Steps;
  const activeStepActivityState =
    activity.state[activeStep.id] || services.createActivityStepState();
  const { fetch: saveActivity } = useApi(requests.activityUpdate);
  const pushUpdate = usePathUpdates(
    TYPE_ACTIVITY,
    activity.id,
    updates => {
      saveActivity(activity.id, updates);
    },
    2000,
  );
  const stepsCount = useMemo(() => getStepsCount(activeChapter), [
    activeChapter,
  ]);
  const currentStepIndex = useMemo(
    () => getStepIndex(activeChapter, activeStep),
    [activeChapter, activeStep],
  );

  const updateActivity = useCallback(
    (path, value) => {
      // TODO - implement logic similar to the lessonUpdates to reduce request payload
      const action = actions.updateActivityProperty(activity, path, value);
      pushUpdate(action);
      dispatch(action);
    },
    [activity, dispatch, pushUpdate],
  );
  const updateStepActivityState = useCallback(
    (activity: LessonActivity, stepId: Step['id'], state: {}) => {
      const action = actions.updateActivityStepState(activity, stepId, state);
      pushUpdate(action);
      dispatch(action);
    },
    [dispatch, pushUpdate],
  );
  const updateStepActivityAnalysis = useCallback(
    (
      activity: LessonActivity,
      stepId: Step['id'],
      path: SubjectPath,
      state: any,
    ) => {
      const action = actions.updateActivityStepAnalysis(
        activity,
        stepId,
        path,
        state,
      );
      pushUpdate(action);
      dispatch(action);
    },
    [dispatch, pushUpdate],
  );

  return (
    <ActivityRenderer
      activity={activity}
      lesson={lesson}
      analysis={activeStepActivityState.analysis}
      activeStep={activeStep}
      chapter={activeChapter}
      updateActivity={updateActivity}
      updateActivityStepState={updateStepActivityState}
      updateActivityStepAnalysis={updateStepActivityAnalysis}
      stepsCount={stepsCount}
      currentStepIndex={currentStepIndex}
      activityStepState={activeStepActivityState}
    />
  );
};

export default Activity;
