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
  Analysis,
  getPreviousStep,
  removeStep,
  Step,
  updateAnalysisActiveStepId,
  updateAnalysisStep,
  updateSubjectState,
} from '@chess-tent/models';
import { components, services } from '@application';

const { StepToolbox } = components;

export default class AnalysisBase<
  T extends AnalysisSystemProps
> extends React.Component<T> {
  updateStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    updateAnalysis(updateAnalysisStep)(analysis, step);
  };
  removeStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    const prevStep = getPreviousStep(analysis, step);
    updateAnalysis(removeStep)(analysis, step, true);
    updateAnalysis(updateSubjectState)(analysis as Analysis<any>, {
      activeStepId: prevStep.id,
    });
  };
  setActiveStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    updateAnalysis(updateAnalysisActiveStepId)(analysis, step.id);
  };
  startAnalysis = (
    position?: FEN,
    move?: Move,
    piece?: Piece,
    captured?: boolean,
    promoted?: PieceRole,
  ) => {
    const {
      analysis,
      updateAnalysis,
      initialOrientation,
      initialPosition,
    } = this.props;
    const notableMove =
      position && move && piece
        ? services.createNotableMove(
            position,
            move,
            1,
            piece,
            captured,
            promoted,
          )
        : undefined;

    updateAnalysis(addStep)(
      analysis,
      services.createStep('variation', {
        position: position || initialPosition,
        orientation: initialOrientation,
        move: notableMove,
      }),
    );
  };

  renderToolbox: EditorSidebarProps['renderToolbox'] = props => {
    const { analysis } = this.props;

    return (
      <StepToolbox
        showInput
        comment
        setActiveStep={this.setActiveStep}
        updateStep={this.updateStep}
        removeStep={this.removeStep}
        stepRoot={analysis}
        updateChapter={() => {}}
        {...props}
        add={false}
        exercise={false}
        paste={false}
      />
    );
  };
}
