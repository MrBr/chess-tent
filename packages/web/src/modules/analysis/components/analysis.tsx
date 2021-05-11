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
  removeStep,
  Step,
  updateAnalysisActiveStepId,
  updateAnalysisStep,
} from '@chess-tent/models';
import { components, services } from '@application';

const { StepToolbox } = components;

export default class AnalysisBase<
  T extends AnalysisSystemProps
> extends React.Component<T> {
  updateStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    updateAnalysis(updateAnalysisStep(analysis, step));
  };
  removeStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    updateAnalysis(removeStep(analysis, step, true));
  };
  setActiveStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    updateAnalysis(updateAnalysisActiveStepId(analysis, step.id));
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

    updateAnalysis(newAnalysis);
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
