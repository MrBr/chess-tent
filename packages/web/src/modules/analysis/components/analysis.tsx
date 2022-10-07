import React from 'react';
import {
  AnalysisBaseInterface,
  AnalysisSystemProps,
  EditorSidebarProps,
  FEN,
  Move,
  Piece,
  PieceRole,
} from '@types';
import {
  addStep,
  getAnalysisActiveStep,
  getPreviousStep,
  removeStep,
  Step,
  updateAnalysisActiveStepId,
  updateAnalysisStep,
  updateSubjectState,
} from '@chess-tent/models';
import { components, services } from '@application';
import { getStepPosition } from '../../step/service';

const { StepToolbox } = components;

export default class AnalysisBase<T extends AnalysisSystemProps>
  extends React.Component<T>
  implements AnalysisBaseInterface
{
  updateStep = (step: Step) => {
    const { updateAnalysis } = this.props;
    updateAnalysis(analysis => {
      updateAnalysisStep(analysis, step);
    });
  };
  removeStep = (step: Step) => {
    const { updateAnalysis } = this.props;
    const prevStep = getPreviousStep(this.props.analysis, step);

    updateAnalysis(analysis => {
      removeStep(analysis, step, true);
      updateSubjectState(analysis, {
        activeStepId: prevStep?.id,
      });
    });
  };
  setActiveStep = (step: Step) => {
    const { updateAnalysis } = this.props;
    updateAnalysis(analysis => {
      updateAnalysisActiveStepId(analysis, step.id);
    });
  };

  addNewAnalysisVariation = () => {
    const { analysis } = this.props;
    const step = getAnalysisActiveStep(analysis);
    const position = getStepPosition(step);
    this.startAnalysis(position);
  };

  startAnalysis = (
    position?: FEN,
    move?: Move,
    piece?: Piece,
    captured?: boolean,
    promoted?: PieceRole,
  ) => {
    const { updateAnalysis, initialOrientation, initialPosition } = this.props;
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

    const newStep = services.createStep('variation', {
      position: position || initialPosition,
      orientation: initialOrientation,
      move: notableMove,
    });
    updateAnalysis(analysis => {
      addStep(analysis, newStep);
    });
    this.setActiveStep(newStep);
  };

  renderToolbox: EditorSidebarProps['renderToolbox'] = props => {
    const { analysis } = this.props;

    return (
      <StepToolbox
        showInput
        setActiveStep={this.setActiveStep}
        updateStep={this.updateStep}
        removeStep={this.removeStep}
        stepRoot={analysis}
        updateChapter={() => {}}
        {...props}
        comment={false}
        add={this.addNewAnalysisVariation}
        exercise={false}
        paste={false}
      />
    );
  };
}
