import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  addStep,
  updateStepState,
  getRightStep,
  getParentStep,
  StepRoot,
} from '@chess-tent/models';
import {
  FEN,
  Move,
  MoveComment,
  MoveModule,
  MoveStep,
  NotableMove,
  PGNHeaders,
  Piece,
  PieceRole,
  PieceRolePromotable,
  Steps,
  VariationStep,
} from '@types';
import { services, components, ui, constants } from '@application';

const { Col, Row } = ui;
const { createNotableMove, createStepsFromNotableMoves } = services;
const { StepTag, Stepper, StepMove } = components;
const { START_FEN, KINGS_FEN } = constants;

const boardChange = (
  stepRoot: StepRoot,
  step: MoveStep,
  updateStep: (step: Steps) => void,
  setActiveStep: (step: Steps) => void,
  newPosition: FEN,
  newMove: Move,
  movedPiece: Piece,
  captured?: boolean,
  promoted?: PieceRole,
) => {
  const {
    state: { move, orientation },
  } = step;

  const moveIndex = services.getNextMoveIndex(move);

  if (movedPiece.color === move.piece.color) {
    // New example
    const newVariationStep = services.createStep('variation', {
      editing: true,
      moveIndex,
      position: newPosition,
      orientation,
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
    promoted,
  );

  const variationStep = getParentStep(stepRoot, step) as VariationStep;
  const rightStep = getRightStep(variationStep, step) as VariationStep;
  // Move that possibly already exists in the chapter
  const sameMoveStep =
    services.getSameMoveStep(variationStep, notableMove) ||
    services.getSameMoveStep(step, notableMove);

  if (sameMoveStep) {
    setActiveStep(sameMoveStep);
    return;
  }

  if (rightStep) {
    const newMoveStep = services.createStep('variation', {
      move: notableMove,
      orientation,
    });
    updateStep(addStep(step, newMoveStep));
    setActiveStep(newMoveStep);
    return;
  }

  const newMoveStep = services.createStep('move', {
    move: notableMove,
    orientation,
  });
  // Continuing the current variation
  updateStep(addStep(variationStep, newMoveStep));
  setActiveStep(newMoveStep);
};

const EditorBoard: MoveModule['EditorBoard'] = ({
  Chessboard,
  step,
  stepRoot,
  updateStep,
  setActiveStep,
}) => {
  const {
    state: {
      shapes,
      move: { position },
      orientation,
    },
  } = step;

  const updateShapes = useCallback(
    (shapes: DrawShape[]) => {
      const updatedStep = updateStepState(step, { shapes });
      updateStep(updatedStep);
    },
    [step, updateStep],
  );

  const onFENChange = useCallback(
    (position: FEN) => {
      const newVariation = services.createStep('variation', {
        position,
        orientation: step.state.orientation,
        editing: true,
      });
      updateStep(addStep(step, newVariation));
      setActiveStep(newVariation);
    },
    [setActiveStep, step, updateStep],
  );

  const onChangeHandle = useCallback(
    (
      newPosition: FEN,
      newMove: Move,
      movedPiece: Piece,
      captured: boolean,
      promoted?: PieceRolePromotable,
    ) => {
      if (services.isLegalMove(step.state.move.position, newMove, promoted)) {
        boardChange(
          stepRoot,
          step,
          updateStep,
          setActiveStep,
          newPosition,
          newMove,
          movedPiece,
          captured,
          promoted,
        );
        return;
      }
      onFENChange(newPosition);
    },
    [stepRoot, step, updateStep, setActiveStep, onFENChange],
  );

  const resetHandle = useCallback(() => {
    const newVariationStep = services.createStep('variation', {
      orientation,
      position: START_FEN,
      editing: true,
    });
    updateStep(addStep(step, newVariationStep));
    setActiveStep(newVariationStep);
  }, [updateStep, step, orientation, setActiveStep]);

  const clearHandle = useCallback(() => {
    const newVariationStep = services.createStep('variation', {
      orientation,
      position: KINGS_FEN,
      editing: true,
    });
    updateStep(addStep(step, newVariationStep));
    setActiveStep(newVariationStep);
  }, [updateStep, step, orientation, setActiveStep]);

  const onPGN = useCallback(
    (moves: NotableMove[], headers: PGNHeaders, comments: MoveComment[]) => {
      const steps = createStepsFromNotableMoves(moves, {
        comments,
        orientation,
      });
      const move = position === headers.FEN ? moves[0] : undefined;
      const variationSteps = move ? steps.splice(1) : steps;
      const newVariation = services.createStep('variation', {
        steps: variationSteps,
        position: headers.FEN,
        move,
        orientation,
      });
      const updatedStep = addStep(step, newVariation);
      updateStep(updatedStep);
      setActiveStep(newVariation);
    },
    [step, updateStep, setActiveStep, orientation, position],
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
      onClear={clearHandle}
      onReset={resetHandle}
      onShapesChange={updateShapes}
      shapes={shapes}
      onPGN={onPGN}
    />
  );
};

const EditorSidebar: MoveModule['EditorSidebar'] = props => {
  const { step, activeStep, updateStep, renderToolbox: StepToolbox } = props;

  return (
    <>
      <Row className="g-0">
        <Col className="col-auto me-2">
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
