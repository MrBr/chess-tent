import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  addStepRightToSame,
  getParentStep,
  updateStepState,
} from '@chess-tent/models';
import { DescriptionModule, DescriptionStep, VariationStep } from '@types';
import { components, ui, stepModules, services } from '@application';
import Comment from './comment';

const { Col, Row } = ui;
const { StepTag } = components;

export const EditorBoard: DescriptionModule['EditorBoard'] = ({
  Chessboard,
  step,
  updateStep,
  stepRoot,
  ...props
}) => {
  const updateShapes = useCallback(
    (shapes: DrawShape[]) => updateStep(updateStepState(step, { shapes })),
    [step, updateStep],
  );

  const parentStep = getParentStep(stepRoot, step) as VariationStep;
  const ParentEditor = stepModules[parentStep.stepType].EditorBoard;

  return (
    <ParentEditor
      {...props}
      step={parentStep}
      stepRoot={stepRoot}
      updateStep={updateStep}
      Chessboard={props => (
        <Chessboard
          {...props}
          shapes={step.state.shapes}
          onShapesChange={updateShapes}
        />
      )}
    />
  );
};

export const EditorSidebar: DescriptionModule['EditorSidebar'] = ({
  step,
  setActiveStep,
  activeStep,
  updateStep,
  stepRoot,
  renderToolbox: StepToolbox,
}) => {
  const addDescriptionStep = useCallback(() => {
    const parentStep = getParentStep(stepRoot, step) as DescriptionStep;
    const newDescriptionStep = services.createStep('description', {
      position: step.state.position,
    });
    updateStep(addStepRightToSame(parentStep, newDescriptionStep));
    setActiveStep(newDescriptionStep);
  }, [stepRoot, step, updateStep, setActiveStep]);

  return (
    <>
      <Row noGutters>
        <Col className="col-auto">
          <StepTag step={step} active={activeStep === step}>
            <Comment active={step === activeStep} />
          </StepTag>
        </Col>
        <Col>
          <StepToolbox
            text={step.state.description}
            active={activeStep === step}
            textChangeHandler={description =>
              updateStep(updateStepState(step, { description }))
            }
            step={step}
            comment={addDescriptionStep}
          />
        </Col>
      </Row>
    </>
  );
};
