import React from 'react';
import {
  ActivityRendererModuleBoardProps,
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
  static analysis = true;

  componentDidUpdate(prevProps: ActivityRendererModuleBoardProps<T>) {
    if (!this.isAnalysing()) {
      document.removeEventListener('keyup', this.handleKeypress);
    } else if (!this.isAnalysing(prevProps)) {
      document.addEventListener('keyup', this.handleKeypress);
    }
  }

  componentDidMount() {
    if (!this.isAnalysing()) {
      return;
    }
    document.addEventListener('keyup', this.handleKeypress);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeypress);
  }

  handleKeypress = (e: KeyboardEvent) => {
    console.log('ANALYSIS');
    if (!this.isAnalysing()) {
      return;
    }
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
    const { analysis, Chessboard, boardState } = this.props;
    const step = getAnalysisActiveStep(analysis);

    // Only applicable to the step ActivityBoard components
    if (props.shapes && boardState.analysing) {
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
