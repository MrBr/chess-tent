import React from 'react';
import {
  ActivityRendererModuleBoardProps,
  ActivityRendererModuleProps,
  ActivityStepMode,
  ChessboardProps,
  Orientation,
  Steps,
} from '@types';
import { components, constants, services, ui } from '@application';
import {
  getAnalysisActiveStep,
  applyNestedPatches,
  getLessonActivityBoardState,
  updateAnalysisStep,
} from '@chess-tent/models';
import ActivityStep from './activity-step';
import { isActivityStepAnalysing } from '../service';

const { AnalysisBoard, AnalysisSidebar, LessonPlaygroundCard } = components;
const { Row, Col, Icon, Text } = ui;
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
    const { analysis, activityStepState } = this.props;
    const isActive = isActivityStepAnalysing(activityStepState);

    return (
      <LessonPlaygroundCard active={isActive}>
        <Row className="align-items-center mb-3">
          <Col className="col-auto">
            <ActivityStep active={isActive}>
              <Icon type="analysis" size="extra-small" />
            </ActivityStep>
          </Col>
          <Col>
            <Text fontSize="small" weight={500} className="mb-2">
              Analysis
            </Text>
          </Col>
          <Col className="col-auto">
            <Icon type="left" size="extra-small" />
            <Icon type="right" size="extra-small" />
          </Col>
        </Row>
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
