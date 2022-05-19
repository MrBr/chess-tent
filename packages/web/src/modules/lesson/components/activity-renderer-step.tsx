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
} from '@chess-tent/models';

import { components, services } from '@application';

const { StepRenderer } = components;

export class ActivityRendererStepBoard<
  T extends Steps,
  K extends Chapter,
> extends React.Component<ActivityRendererModuleBoardProps<T, K>> {
  static mode = ActivityStepMode.SOLVING;
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
    const { updateActivity, activity, boardState } = this.props;
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
