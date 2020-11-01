import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  getParentStep,
  addStepRightToSame,
  updateStepState,
} from '@chess-tent/models';
import { DescriptionModule, VariationStep } from '@types';
import { components, services, ui, stepModules } from '@application';
import Comment from './comment';

const { Col, Row, Container } = ui;
const { StepTag, StepToolbox } = components;

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
  stepRoot,
  updateStep,
  removeStep,
}) => {
  const addDescriptionStep = useCallback(() => {
    const parentStep = getParentStep(stepRoot, step);
    const newDescriptionStep = services.createStep('description', {
      position: step.state.position,
    });
    updateStep(addStepRightToSame(parentStep, newDescriptionStep));
    setActiveStep(newDescriptionStep);
  }, [stepRoot, step, updateStep, setActiveStep]);
  const removeDescriptionStep = useCallback(() => {
    removeStep(step);
  }, [step, removeStep]);

  const handleStepClick = useCallback(
    event => {
      event.stopPropagation();
      activeStep !== step && setActiveStep(step);
    },
    [step, activeStep, setActiveStep],
  );

  return (
    <Container onClick={handleStepClick} fluid className="p-0">
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
            addStepHandler={addDescriptionStep}
            deleteStepHandler={removeDescriptionStep}
          />
        </Col>
      </Row>
    </Container>
  );
};
