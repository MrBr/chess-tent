import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  addStepToRightOf,
  getParentStep,
  updateStepState,
} from '@chess-tent/models';
import { DescriptionModule, DescriptionStep, FEN, VariationStep } from '@types';
import { components, ui, stepModules, services } from '@application';
import Comment from './comment';

const { Col, Row } = ui;
const { StepTag, EditorSidebarStepContainer } = components;

export const EditorBoard: DescriptionModule['EditorBoard'] = ({
  Chessboard,
  step,
  updateStep,
  stepRoot,
  ...props
}) => {
  const {
    state: { position },
  } = step;
  const updateShapes = useCallback(
    (shapes: DrawShape[]) => updateStep(updateStepState(step, { shapes })),
    [step, updateStep],
  );

  const onChangeHandle = useCallback(
    (newPosition: FEN) =>
      updateStep(updateStepState(step, { position: newPosition })),
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
          sparePieces
          editing
          fen={position}
          shapes={step.state.shapes}
          onPGN={props.onPGN}
          onShapesChange={updateShapes}
          onPieceDrop={onChangeHandle}
          onPieceRemove={onChangeHandle}
          onChange={onChangeHandle}
          onFENSet={onChangeHandle}
        />
      )}
    />
  );
};

export const EditorSidebar: DescriptionModule['EditorSidebar'] = props => {
  const {
    step,
    setActiveStep,
    activeStep,
    updateStep,
    stepRoot,
    renderToolbox: StepToolbox,
    removeStep,
  } = props;
  const addDescriptionStep = useCallback(() => {
    const parentStep = getParentStep(stepRoot, step) as DescriptionStep;
    const newDescriptionStep = services.createStep('description', {
      position: step.state.position,
      orientation: step.state.orientation,
    });
    updateStep(addStepToRightOf(parentStep, step, newDescriptionStep));
    setActiveStep(newDescriptionStep);
  }, [stepRoot, step, updateStep, setActiveStep]);
  const addVariationStep = useCallback(() => {
    const parentStep = getParentStep(stepRoot, step) as DescriptionStep;
    const newVariationStep = services.createStep('variation', {
      position: step.state.position,
      orientation: step.state.orientation,
    });
    updateStep(addStepToRightOf(parentStep, step, newVariationStep));
    setActiveStep(newVariationStep);
  }, [stepRoot, step, updateStep, setActiveStep]);
  const addExerciseStep = useCallback(() => {
    const parentStep = getParentStep(stepRoot, step) as DescriptionStep;
    const newExerciseStep = services.createStep('exercise', {
      position: step.state.position,
      orientation: step.state.orientation,
    });
    updateStep(addStepToRightOf(parentStep, step, newExerciseStep));
    setActiveStep(newExerciseStep);
  }, [stepRoot, step, updateStep, setActiveStep]);
  const removeDescriptionStep = useCallback(() => {
    removeStep(step, false);
  }, [removeStep, step]);

  return (
    <EditorSidebarStepContainer
      {...props}
      text={step.state.description}
      textChangeHandler={description =>
        updateStep(updateStepState(step, { description }))
      }
    >
      <Row className="g-0">
        <Col className="col-auto me-2">
          <StepTag active={activeStep === step}>
            <Comment active={step === activeStep} />
          </StepTag>
        </Col>
        <Col>
          <StepToolbox
            active={activeStep === step}
            step={step}
            add={addVariationStep}
            comment={addDescriptionStep}
            exercise={addExerciseStep}
            remove={removeDescriptionStep}
          />
        </Col>
      </Row>
    </EditorSidebarStepContainer>
  );
};
