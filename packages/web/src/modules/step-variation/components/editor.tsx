import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  addStep,
  updateStepState,
  Step,
  addStepToLeft,
  getNextStep,
  addStepRightToSame,
} from '@chess-tent/models';
import {
  FEN,
  Move,
  MoveStep,
  Piece,
  VariationModule,
  VariationStep,
} from '@types';
import { components, services, ui } from '@application';
import Footer from './footer';
import BoardSrc from '../images/board.svg';

const { Col, Row, Container, Img } = ui;
const { Stepper, StepTag, StepToolbox, StepMove } = components;

const boardChange = (
  step: VariationStep,
  updateStep: (step: Step) => void,
  setActiveStep: (step: Step) => void,
  newPosition: FEN,
  newMove?: Move,
  movedPiece?: Piece,
) => {
  const {
    state: { editing, move, position },
  } = step;

  if (editing && position) {
    updateStep(
      updateStepState(step, {
        position: newPosition,
        editing: true,
        steps: [],
        move: null,
      }),
    );
    return;
  }

  if (editing || !newMove || !movedPiece) {
    const newVariationStep = services.createStep('variation', {
      position: newPosition,
      editing: true,
    });
    const updatedStep = updateStepState(
      addStepRightToSame(step, newVariationStep) as VariationStep,
      {
        editing: false,
      },
    );
    updateStep(updatedStep);
    setActiveStep(newVariationStep);
    return;
  }

  const notableMove = services.createNotableMove(
    newPosition,
    newMove,
    move ? move.index + 1 : 1,
    movedPiece,
  );

  const nextStep = getNextStep(step, step) as MoveStep;

  // Move that possibly already exists in the chapter
  const sameMoveStep = services.getSameMoveVariationStep(step, notableMove);

  if (sameMoveStep) {
    setActiveStep(sameMoveStep);
    return;
  }

  if (nextStep) {
    const newMoveStep = services.createStep('variation', {
      move: notableMove,
    });
    updateStep(addStepToLeft(step, newMoveStep));
    setActiveStep(newMoveStep);
    return;
  }

  const newMoveStep = services.createStep('move', {
    move: notableMove,
  });
  updateStep(addStep(step, newMoveStep));
  setActiveStep(newMoveStep);
};

const EditorBoard: VariationModule['EditorBoard'] = ({
  Chessboard,
  step,
  status,
  updateStep,
  setActiveStep,
}) => {
  const {
    state: { shapes, editing, move },
  } = step;

  const position = move ? move.position : (step.state.position as FEN);

  const updateEditing = useCallback(
    (editing: boolean) => updateStep(updateStepState(step, { editing })),
    [updateStep, step],
  );

  const updateShapes = useCallback(
    (shapes: DrawShape[]) => updateStep(updateStepState(step, { shapes })),
    [step, updateStep],
  );

  const onChangeHandle = useCallback(
    (newPosition: FEN, newMove?: Move, movedPiece?: Piece) =>
      boardChange(
        step,
        updateStep,
        setActiveStep,
        newPosition,
        newMove,
        movedPiece,
      ),
    [step, updateStep, setActiveStep],
  );
  const onPieceAddRemove = useCallback(
    (newPosition: FEN) =>
      boardChange(step, updateStep, setActiveStep, newPosition),
    [step, updateStep, setActiveStep],
  );

  return (
    <Chessboard
      edit
      sparePieces
      fen={position}
      onMove={onChangeHandle}
      onShapesChange={updateShapes}
      onPieceDrop={onPieceAddRemove}
      onPieceRemove={onPieceAddRemove}
      shapes={shapes}
      header={status}
      footer={<Footer updateEditing={updateEditing} editing={!!editing} />}
    />
  );
};

const EditorSidebar: VariationModule['EditorSidebar'] = props => {
  const { step, setActiveStep, activeStep, updateStep, removeStep } = props;
  const position = step.state.move
    ? step.state.move.position
    : (step.state.position as FEN);
  const addDescriptionStep = useCallback(() => {
    const descriptionStep = services.createStep('description', {
      position,
    });
    updateStep(addStepToLeft(step, descriptionStep));
  }, [position, step, updateStep]);
  const removeVariationStep = useCallback(() => {
    removeStep(step);
  }, [step, removeStep]);
  const addExerciseStep = useCallback(() => {
    const exerciseStep = services.createStep('exercise', {
      position,
    });
    updateStep(addStepToLeft(step, exerciseStep));
    setActiveStep(exerciseStep);
  }, [position, setActiveStep, step, updateStep]);
  const handleStepClick = useCallback(
    event => {
      event.stopPropagation();
      activeStep !== step && setActiveStep(step);
    },
    [step, activeStep, setActiveStep],
  );

  return (
    <Container onClick={handleStepClick} fluid className="p-0">
      <Row className="no-gutters">
        <Col className="col-auto">
          <StepTag
            step={step}
            active={activeStep === step}
            move={step.state.move}
          >
            {step.state.move ? (
              <StepMove move={step.state.move} />
            ) : (
              <Img src={BoardSrc} style={{ background: '#ffffff' }} />
            )}
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
            deleteStepHandler={removeVariationStep}
            addExerciseHandler={addExerciseStep}
          />
        </Col>
      </Row>
      <Stepper {...props} stepRoot={step} />
    </Container>
  );
};

export { EditorBoard, EditorSidebar };
