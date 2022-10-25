import React from 'react';
import {
  ActivityRendererModuleBoardProps,
  ActivityStepMode,
  ChessboardProps,
  Orientation,
  Steps,
} from '@types';
import { components, services, utils } from '@application';
import { getAnalysisActiveStep, updateAnalysisStep } from '@chess-tent/models';
import { ActivityAnalysis } from './activity-analysis';

const { AnalysisBoard } = components;
const { createKeyboardNavigationHandler } = utils;

export class ActivityRendererAnalysisBoard<
  T extends Steps | undefined,
> extends ActivityAnalysis<ActivityRendererModuleBoardProps<T>> {
  static mode = ActivityStepMode.ANALYSING;

  componentDidMount() {
    document.addEventListener('keyup', this.handleKeypress);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeypress);
  }

  handleKeypress = (e: KeyboardEvent) => {
    console.warn('TODO - add tooltip when analysis end is reached');
    createKeyboardNavigationHandler(
      this.prevStep,
      this.nextStep,
      this.nextVariation,
      this.prevVariation,
    )(e);
  };

  updateStepRotation = (orientation?: Orientation) => {
    const step = getAnalysisActiveStep(this.props.analysis);
    const updatedStep = services.updateStepRotation(step, orientation);
    this.updateStepActivityAnalysis(analysis => {
      updateAnalysisStep(analysis, updatedStep);
    });
  };

  renderAnalysisBoard = (props: ChessboardProps) => {
    const { analysis, Chessboard, activityStepState } = this.props;
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
      />
    );
  };

  render() {
    const { activityStepState } = this.props;

    return (
      <AnalysisBoard
        active
        analysis={activityStepState.analysis}
        updateAnalysis={this.updateStepActivityAnalysis}
        initialPosition={this.getInitialPosition()}
        initialOrientation={this.getInitialOrientation()}
        Chessboard={this.renderAnalysisBoard}
      />
    );
  }
}
