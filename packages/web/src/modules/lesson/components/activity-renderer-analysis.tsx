import React from 'react';
import {
  ActivityRendererModuleBoardProps,
  ActivityRendererModuleProps,
  ActivityStepMode,
  ChessboardProps,
  Orientation,
  Steps,
} from '@types';
import { components, constants, services } from '@application';
import {
  getAnalysisActiveStep,
  applyNestedPatches,
  getLessonActivityBoardState,
  updateActivityStepState,
  updateAnalysisStep,
} from '@chess-tent/models';

const { AnalysisBoard, AnalysisSidebar, LessonPlaygroundCard } = components;
const { START_FEN } = constants;

abstract class ActivityRendererAnalysis<
  T extends ActivityRendererModuleProps<Steps | undefined>,
> extends React.Component<T> {
  isAnalysing() {
    const { activityStepState } = this.props;
    return activityStepState.mode === ActivityStepMode.ANALYSING;
  }

  getInitialPosition() {
    const { step } = this.props;
    return step ? services.getStepPosition(step) : START_FEN;
  }

  getInitialOrientation() {
    const { step } = this.props;
    return step ? services.getStepBoardOrientation(step) : undefined;
  }

  updateStepActivityAnalysis =
    <T extends any[], U>(service: (...args: T) => U) =>
    (...args: T) => {
      const { updateActivity, activity, boardState } = this.props;
      updateActivity(applyNestedPatches(service)(...args))(
        activity,
        draft =>
          getLessonActivityBoardState(draft, boardState.id)[
            boardState.activeStepId
          ].analysis,
      );
    };
}

export class ActivityRendererAnalysisBoard<
  T extends Steps | undefined,
> extends ActivityRendererAnalysis<ActivityRendererModuleBoardProps<T>> {
  static mode = ActivityStepMode.ANALYSING;

  updateStepRotation = (orientation?: Orientation) => {
    const { analysis } = this.props;
    const step = getAnalysisActiveStep(analysis);
    const updatedStep = services.updateStepRotation(step, orientation);
    this.updateStepActivityAnalysis(updateAnalysisStep)(analysis, updatedStep);
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
        analysis={activityStepState.analysis}
        updateAnalysis={this.updateStepActivityAnalysis}
        initialPosition={this.getInitialPosition()}
        initialOrientation={this.getInitialOrientation()}
        Chessboard={this.renderAnalysisBoard}
      />
    );
  }
}

export class ActivityRendererAnalysisCard<
  T extends Steps | undefined,
> extends ActivityRendererAnalysis<ActivityRendererModuleProps<T>> {
  render() {
    const { analysis } = this.props;

    return (
      <LessonPlaygroundCard>
        <AnalysisSidebar
          analysis={analysis}
          updateAnalysis={this.updateStepActivityAnalysis}
          initialPosition={this.getInitialPosition()}
          initialOrientation={this.getInitialOrientation()}
        />
      </LessonPlaygroundCard>
    );
  }
}
