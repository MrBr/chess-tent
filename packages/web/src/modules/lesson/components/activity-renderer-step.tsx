import React from 'react';
import {
  ActivityRendererModuleProps,
  ChessboardProps,
  FEN,
  Move,
  Piece,
  PieceRole,
  Shape,
  ActivityStepMode,
  ActivityRendererModuleBoardProps,
  Steps,
} from '@types';
import {
  addStep,
  getLessonActivityBoardState,
  updateAnalysisActiveStepId,
  applyUpdates,
  Chapter,
  getLessonChapterIndex,
} from '@chess-tent/models';

import { components, services, ui, utils } from '@application';
import { isActivityStepSolving, updateActivityActiveChapter } from '../service';

const { StepRenderer } = components;
const { Button, Icon, Row, Col } = ui;
const { createKeyboardNavigationHandler } = utils;

class ActivityRendererStepNavigation<
  T extends Steps,
  K extends Chapter,
> extends React.Component<ActivityRendererModuleProps<T, K>> {
  nextChapter = () => {
    const { chapter, activity, updateActivity, boardState } = this.props;

    if (!chapter) {
      return;
    }

    const nextChapterIndex =
      getLessonChapterIndex(activity.subject, chapter.id) + 1;
    const nextChapter = activity.subject.state.chapters[nextChapterIndex];

    if (!nextChapter) {
      return;
    }

    updateActivity(updateActivityActiveChapter)(
      activity,
      boardState,
      nextChapter,
    );
  };

  render() {
    const { nextStep, prevStep } = this.props;
    return (
      <>
        <Row>
          <Col>
            <Button variant="ghost" stretch size="small" onClick={prevStep}>
              <Icon type="left" />
            </Button>
          </Col>
          <Col>
            <Button variant="ghost" stretch size="small" onClick={nextStep}>
              <Icon type="right" />
            </Button>
          </Col>
          <Col>
            <Button
              variant="ghost"
              stretch
              size="small"
              onClick={this.nextChapter}
            >
              Chapter <Icon type="right" size="small" />
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}
export class ActivityRendererStepBoard<
  T extends Steps,
  K extends Chapter,
> extends React.Component<ActivityRendererModuleBoardProps<T, K>> {
  static mode = ActivityStepMode.SOLVING;
  static Navigation = ActivityRendererStepNavigation;

  componentDidMount() {
    document.addEventListener('keyup', this.handleKeypress);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeypress);
  }

  handleKeypress = (e: KeyboardEvent) => {
    const { nextStep, prevStep } = this.props;
    createKeyboardNavigationHandler(prevStep, nextStep)(e);
  };

  updateStepShapes = (shapes: Shape[]) => {
    this.props.setStepActivityState({ shapes });
  };

  startAnalysingPosition = (
    position: FEN,
    move: Move,
    piece: Piece,
    captured?: boolean,
    promoted?: PieceRole,
  ) => {
    const { step, updateActivity, activity, boardState } = this.props;
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

    updateActivity(
      applyUpdates(activity)(draft => {
        const activityStepStateDraft = getLessonActivityBoardState(
          draft,
          boardState.id,
        )[boardState.activeStepId];
        const analysisDraft = activityStepStateDraft.analysis;
        activityStepStateDraft.mode = ActivityStepMode.ANALYSING;
        addStep(analysisDraft, newStep);

        updateAnalysisActiveStepId(analysisDraft, newStep.id);
      }),
    )();
  };

  renderActivityBoard = (props: ChessboardProps) => {
    const { step, stepActivityState, Chessboard } = this.props;
    return (
      <Chessboard
        onMove={this.startAnalysingPosition}
        allowAllMoves
        orientation={step.state.orientation}
        footer={null}
        onShapesChange={this.updateStepShapes}
        shapes={stepActivityState.shapes}
        {...props}
      />
    );
  };

  render() {
    const { chapter, step } = this.props;

    return (
      <StepRenderer
        {...this.props}
        activeStep={step}
        stepRoot={chapter}
        setActiveStep={() => {}}
        component="ActivityBoard"
        Chessboard={this.renderActivityBoard}
      />
    );
  }
}

export class ActivityRendererStepCard<
  T extends Steps,
  K extends Chapter,
> extends React.Component<ActivityRendererModuleProps<T, K>> {
  setSolvingMode = () => {
    const { activityStepState, updateActivity, activity, boardState } =
      this.props;
    if (isActivityStepSolving(activityStepState)) {
      return;
    }
    updateActivity(
      applyUpdates(activity)(draft => {
        const activityStepStateDraft = getLessonActivityBoardState(
          draft,
          boardState.id,
        )[boardState.activeStepId];
        activityStepStateDraft.mode = ActivityStepMode.SOLVING;
      }),
    )();
  };

  render() {
    const { chapter, step } = this.props;

    // key is needed in order to force render once the step changes
    return (
      <section onClick={this.setSolvingMode} key={step.id}>
        <StepRenderer
          {...this.props}
          component="ActivitySidebar"
          stepRoot={chapter}
          activeStep={step}
          setActiveStep={() => {}}
          Chessboard={() => null}
        />
      </section>
    );
  }
}
