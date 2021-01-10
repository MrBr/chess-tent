import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  addStep,
  updateStepState,
  Step,
  getNextStep,
} from '@chess-tent/models';
import {
  FEN,
  Move,
  MoveStep,
  Piece,
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
  getSameMoveVariationStep,
  createNotableMove,
} = services;
const { START_FEN, KINGS_FEN } = constants;

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

  if (!newMove || !movedPiece) {
    // New piece dropped or removed
    const newVariationStep = createStep('variation', {
      position: newPosition,
      editing: true,
    });
    const updatedStep = updateStepState(
      addStepNextToTheComments(step, newVariationStep) as VariationStep,
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
  );

  const nextStep = getNextStep(step, step) as MoveStep;

  // Move that possibly already exists in the chapter
  const sameMoveStep = getSameMoveVariationStep(step, notableMove);

  if (sameMoveStep) {
    setActiveStep(sameMoveStep);
    return;
  }

  if (nextStep) {
    const newMoveStep = createStep('variation', {
      move: notableMove,
    });
    updateStep(addStepNextToTheComments(step, newMoveStep));
    setActiveStep(newMoveStep);
    return;
  }

  const newMoveStep = createStep('move', {
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
  const resetHandle = useCallback(() => {
    if (editing) {
      updateStep(updateStepState(step, { position: START_FEN }));
    } else {
      const variationStep = createStep('variation', {
        position: START_FEN,
      });
      updateStep(addStep(step, variationStep));
      setActiveStep(variationStep);
    }
  }, [editing, updateStep, step, setActiveStep]);
  const clearHandle = useCallback(() => {
    if (editing) {
      updateStep(updateStepState(step, { position: KINGS_FEN }));
    } else {
      const variationStep = createStep('variation', {
        position: KINGS_FEN,
        editing: true,
      });
      updateStep(addStep(step, variationStep));
      setActiveStep(variationStep);
    }
  }, [editing, updateStep, step, setActiveStep]);

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
  const onFENChange = useCallback(
    (newPosition: FEN) =>
      boardChange(step, updateStep, setActiveStep, newPosition),
    [step, updateStep, setActiveStep],
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
      header={status}
      onUpdateEditing={updateEditing}
      editing={!!editing}
      onReset={resetHandle}
      onClear={clearHandle}
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
