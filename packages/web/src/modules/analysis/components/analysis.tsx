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
  Analysis,
  getPreviousStep,
  removeStep,
  Step,
  updateAnalysisActiveStepId,
  updateAnalysisStep,
  updateSubject,
  updateSubjectState,
} from '@chess-tent/models';
import { components, services } from '@application';

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
  updateStepRoot = (updatedAnalysis: Analysis<any>) => {
    const { updateAnalysis } = this.props;
    updateAnalysis(analysis => {
      updateSubject(analysis, updatedAnalysis);
    });
  };
  removeStep = (step: Step) => {
    const { updateAnalysis, analysis } = this.props;
    const prevStep = getPreviousStep(analysis, step);
    // If step is root variations don't delete other variations
    const deleteChildSteps = step.stepType !== 'variation';

    updateAnalysis(analysis => {
      removeStep(analysis, step, deleteChildSteps);
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
        setActiveStep={this.setActiveStep}
        updateStep={this.updateStep}
        removeStep={this.removeStep}
        stepRoot={analysis}
        updateChapter={() => {}}
        {...props}
        exercise={false}
        paste={false}
      />
    );
  };
}
