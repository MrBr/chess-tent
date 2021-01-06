import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  addStep,
  Step,
  updateStepState,
  getRightStep,
  getParentStep,
  StepRoot,
} from '@chess-tent/models';
import { FEN, Move, MoveModule, MoveStep, Piece, VariationStep } from '@types';
import { services, components, ui } from '@application';

const { Col, Row } = ui;
const { getPiece, createNotableMove } = services;
const { StepTag, Stepper, StepMove } = components;

const boardChange = (
  stepRoot: StepRoot,
  step: MoveStep,
  updateStep: (step: Step) => void,
  setActiveStep: (step: Step) => void,
  newPosition: FEN,
  newMove: Move,
  movedPiece: Piece,
  captured?: boolean,
) => {
  const {
    state: { move },
  } = step;
  const { position } = move;

  const moveIndex =
    movedPiece.color === 'white'
      ? step.state.move.index + 1
      : step.state.move.index;

  const previousPiece = getPiece(position, move.move[1]) as Piece;
  if (movedPiece.color === previousPiece.color) {
    // New example
    const newVariationStep = services.createStep('variation', {
      editing: true,
      moveIndex,
      position: newPosition,
    });

    updateStep(addStep(step, newVariationStep));
    setActiveStep(newVariationStep);
    return;
  }

  const notableMove = createNotableMove(
    newPosition,
    newMove,
    moveIndex,
    movedPiece,
    captured,
  );

  const variationStep = getParentStep(stepRoot, step) as VariationStep;
  const rightStep = getRightStep(variationStep, step) as VariationStep;
  // Move that possibly already exists in the chapter
  let sameMoveStep = services.getSameMoveVariationStep(step, notableMove);
  if (!sameMoveStep) {
    sameMoveStep =
      rightStep && services.isSameStepMove(rightStep, notableMove)
        ? rightStep
        : null;
  }
  if (sameMoveStep) {
    setActiveStep(sameMoveStep);
    return;
  }

  if (rightStep) {
    const newMoveStep = services.createStep('variation', {
      move: notableMove,
    });
    updateStep(addStep(step, newMoveStep));
    setActiveStep(newMoveStep);
    return;
  }

  const newMoveStep = services.createStep('move', {
    move: notableMove,
  });
  // Continuing the current variation
  updateStep(addStep(variationStep, newMoveStep));
  setActiveStep(newMoveStep);
};

const EditorBoard: MoveModule['EditorBoard'] = ({
  Chessboard,
  step,
  status,
  stepRoot,
  updateStep,
  setActiveStep,
}) => {
  const {
    state: {
      shapes,
      move: { position },
    },
  } = step;

  const updateShapes = useCallback(
    (shapes: DrawShape[]) => {
      const updatedStep = updateStepState(step, { shapes });
      console.log(updatedStep.state.shapes);
      updateStep(updatedStep);
    },
    [step, updateStep],
  );

  const onChangeHandle = useCallback(
    (newPosition: FEN, newMove: Move, movedPiece: Piece, captured: boolean) =>
      boardChange(
        stepRoot,
        step,
        updateStep,
        setActiveStep,
        newPosition,
        newMove,
        movedPiece,
        captured,
      ),
    [stepRoot, step, updateStep, setActiveStep],
  );
  const onFENChange = useCallback(
    (position: FEN) => {
      const newVariation = services.createStep('variation', {
        position,
        editing: true,
      });
      updateStep(addStep(step, newVariation));
      setActiveStep(newVariation);
    },
    [setActiveStep, step, updateStep],
  );

  return (
    <Chessboard
      allowAllMoves
      sparePieces
      fen={position}
      onMove={onChangeHandle}
      onPieceRemove={onFENChange}
      onPieceDrop={onFENChange}
      onFENSet={onFENChange}
      header={status}
      onShapesChange={updateShapes}
      shapes={shapes}
    />
  );
};

const EditorSidebar: MoveModule['EditorSidebar'] = props => {
  const { step, activeStep, updateStep, renderToolbox: StepToolbox } = props;

  return (
    <>
      <Row noGutters>
        <Col className="col-auto">
          <StepTag active={activeStep === step}>
            <StepMove move={step.state.move} />
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
          />
        </Col>
      </Row>
      <Stepper {...props} stepRoot={step} />
    </>
  );
};

export { EditorBoard, EditorSidebar };
