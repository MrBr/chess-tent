import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import { addStep, updateStepState, getLastStep } from '@chess-tent/models';
import {
  AppStep,
  FEN,
  Move,
  MoveComment,
  NotableMove,
  PGNHeaders,
  Piece,
  PieceRolePromotable,
  VariationModule,
  VariationStep,
} from '@types';
import { components, constants, services, ui } from '@application';
import BoardSrc from '../images/board.svg';

const { Col, Row, Img } = ui;
const { Stepper, StepTag, StepMove } = components;
const {
  addStepNextToTheComments,
  createStep,
  getSameMoveStep,
  createNotableMove,
  isLegalMove,
  createStepsFromNotableMoves,
} = services;
const { START_FEN, KINGS_FEN } = constants;

const boardChange = (
  step: VariationStep,
  updateStep: (step: VariationStep) => void,
  setActiveStep: (step: AppStep) => void,
  newPosition: FEN,
  newMove?: Move,
  movedPiece?: Piece,
  captured?: boolean,
  promoted?: PieceRolePromotable,
) => {
  const {
    state: { editing, move, position, orientation },
  } = step;

  if (editing && position) {
    updateStep(
      updateStepState(step, {
        position: newPosition,
        editing: true,
        move: null,
      }),
    );
    return;
  }

  if (
    !newMove ||
    !movedPiece ||
    !isLegalMove(position, newMove, promoted, true)
  ) {
    // New piece dropped or removed
    const newVariationStep = createStep('variation', {
      position: newPosition,
      editing: true,
      orientation,
    });
    const updatedStep = updateStepState(
      addStep(step, newVariationStep) as VariationStep,
      {
        editing: false,
      },
    );
    updateStep(updatedStep);
    setActiveStep(newVariationStep);
    return;
  }

  const notableMove = createNotableMove(
    newPosition,
    newMove,
    move ? move.index + 1 : 1,
    movedPiece,
    captured,
    promoted,
  );

  const hasMoveStep = getLastStep(step, false).stepType === 'move';

  // Move that possibly already exists in the chapter
  const sameMoveStep = getSameMoveStep(step, notableMove);

  if (sameMoveStep) {
    setActiveStep(sameMoveStep);
    return;
  }

  if (hasMoveStep) {
    const newMoveStep = createStep('variation', {
      move: notableMove,
      orientation,
    });
    updateStep(addStepNextToTheComments(step, newMoveStep));
    setActiveStep(newMoveStep);
    return;
  }

  const newMoveStep = createStep('move', {
    move: notableMove,
    orientation,
  });
  updateStep(addStep(step, newMoveStep));
  setActiveStep(newMoveStep);
};

const EditorBoard: VariationModule['EditorBoard'] = ({
  Chessboard,
  step,
  updateStep,
  setActiveStep,
}) => {
  const {
    state: { shapes, editing, move, orientation },
  } = step;

  const position = move ? move.position : (step.state.position as FEN);

  const updateEditing = useCallback(
    (editing: boolean) => updateStep(updateStepState(step, { editing })),
    [updateStep, step],
  );

  const resetHandle = useCallback(() => {
    updateStep(updateStepState(step, { position: START_FEN, editing: true }));
  }, [updateStep, step]);

  const clearHandle = useCallback(() => {
    updateStep(updateStepState(step, { position: KINGS_FEN, editing: true }));
  }, [updateStep, step]);

  const updateShapes = useCallback(
    (shapes: DrawShape[]) => updateStep(updateStepState(step, { shapes })),
    [step, updateStep],
  );

  const onChangeHandle = useCallback(
    (
      newPosition: FEN,
      newMove?: Move,
      movedPiece?: Piece,
      captured?: boolean,
      promoted?: PieceRolePromotable,
    ) =>
      boardChange(
        step,
        updateStep,
        setActiveStep,
        newPosition,
        newMove,
        movedPiece,
        captured,
        promoted,
      ),
    [step, updateStep, setActiveStep],
  );

  const onFENChange = useCallback(
    (newPosition: FEN) =>
      boardChange(step, updateStep, setActiveStep, newPosition),
    [step, updateStep, setActiveStep],
  );

  const onPGN = useCallback(
    (moves: NotableMove[], headers: PGNHeaders, comments: MoveComment[]) => {
      const steps = createStepsFromNotableMoves(moves, {
        comments,
        orientation,
      });
      const pgnInitialPosition = headers.FEN;
      if (step.state.steps.length === 0) {
        const updatedStep = updateStepState(step, {
          steps,
          position: pgnInitialPosition,
        });
        updateStep(updatedStep);
      } else {
        const move = position === pgnInitialPosition ? moves[0] : undefined;
        const variationSteps = move ? steps.splice(1) : steps;
        const newVariation = createStep('variation', {
          steps: variationSteps,
          position: pgnInitialPosition,
          orientation,
          move,
        });
        const updatedStep = addStep(step, newVariation);
        setActiveStep(newVariation);
        updateStep(updatedStep);
      }
    },
    [step, updateStep, setActiveStep, orientation, position],
  );

  return (
    <Chessboard
      allowAllMoves
      sparePieces
      fen={position}
      onMove={onChangeHandle}
      onShapesChange={updateShapes}
      onPieceDrop={onFENChange}
      onPieceRemove={onFENChange}
      onFENSet={onFENChange}
      shapes={shapes}
      onUpdateEditing={updateEditing}
      editing={!!editing}
      onReset={resetHandle}
      onClear={clearHandle}
      onPGN={onPGN}
    />
  );
};

const EditorSidebar: VariationModule['EditorSidebar'] = props => {
  const { step, activeStep, updateStep, renderToolbox: StepToolbox } = props;

  return (
    <>
      <Row className="no-gutters">
        <Col className="col-auto">
          <StepTag active={activeStep === step}>
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
            step={step}
          />
        </Col>
      </Row>
      <Stepper {...props} stepRoot={step} />
    </>
  );
};

export { EditorBoard, EditorSidebar };
