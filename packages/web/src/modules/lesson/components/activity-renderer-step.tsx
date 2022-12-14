import React from 'react';
import {
  ActivityRendererModuleProps,
  ChessboardProps,
  FEN,
  Move,
  Piece,
  PieceRole,
  Shape,
  ActivityRendererModuleBoardProps,
  Steps,
} from '@types';
import { startAnalysingStep, Chapter } from '@chess-tent/models';

import { components, services } from '@application';

const { StepRenderer } = components;

export class ActivityRendererStepBoard<
  T extends Steps,
  K extends Chapter,
> extends React.Component<ActivityRendererModuleBoardProps<T, K>> {
  updateStepShapes = (shapes: Shape[]) => {
    this.props.setStepActivityState({ shapes });
  };

  startAnalysingPosition = (
    position: FEN,
    move?: Move,
    piece?: Piece,
    captured?: boolean,
    promoted?: PieceRole,
  ) => {
    const { step, updateActivity, activity, boardState } = this.props;
    const notableMove =
      move && piece
        ? services.createNotableMove(
            position,
            move,
            1,
            piece,
            captured,
            promoted,
          )
        : undefined;

    const newStep = services.createStep('variation', {
      position: position,
      orientation: step.state.orientation,
      move: notableMove,
    });

    updateActivity(startAnalysingStep)(activity, boardState.id, newStep);
  };

  renderActivityBoard = (props: ChessboardProps) => {
    const { step, stepActivityState, Chessboard } = this.props;
    return (
      <Chessboard
        allowAllMoves
        sparePieces
        onMove={this.startAnalysingPosition}
        onChange={this.startAnalysingPosition}
        orientation={step.state.orientation}
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
  render() {
    const { chapter, step } = this.props;

    // key is needed in order to force render once the step changes
    return (
      <section key={step.id}>
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
