import React from 'react';
import {
  AnalysisSystemProps,
  EditorSidebarProps,
  FEN,
  Move,
  Piece,
  PieceRole,
} from '@types';
import {
  addStep,
  getParentStep,
  getStepPath,
  isStep,
  removeStep,
  Step,
} from '@chess-tent/models';
import { components, services } from '@application';

const { StepToolbox } = components;

export default class Analysis<
  T extends AnalysisSystemProps
> extends React.Component<T> {
  updateStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    updateAnalysis(getStepPath(analysis, step), step);
  };
  removeStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    const parentStep = getParentStep(analysis, step);
    if (!isStep(parentStep)) {
      const newAnalysis = removeStep(analysis, step);
      updateAnalysis(['state', 'steps'], newAnalysis.state.steps);
      return;
    }
    updateAnalysis(
      getStepPath(analysis, parentStep),
      removeStep(parentStep, step, true),
    );
  };
  setActiveStep = (step: Step) => {
    const { updateAnalysis } = this.props;
    updateAnalysis(['state', 'activeStepId'], step.id);
  };
  startAnalysis = (
    position: FEN,
    move: Move,
    piece: Piece,
    captured?: boolean,
    promoted?: PieceRole,
  ) => {
    const { analysis, updateAnalysis } = this.props;
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

    updateAnalysis(['state', 'steps'], newAnalysis.state.steps);
  };
  renderToolbox: EditorSidebarProps['renderToolbox'] = props => {
    const { analysis } = this.props;
    return (
      <StepToolbox
        setActiveStep={this.setActiveStep}
        updateStep={this.updateStep}
        removeStep={this.removeStep}
        add={false}
        comment={false}
        exercise={false}
        showInput={false}
        paste={false}
        stepRoot={analysis}
        updateChapter={() => {}}
        {...props}
      />
    );
  };
}
