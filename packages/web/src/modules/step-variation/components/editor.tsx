import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  addStep,
  updateStepState,
  getLastStep,
  addVariationStep,
  Chapter,
} from '@chess-tent/models';
import {
  AppStep,
  FEN,
  Move,
  Piece,
  PieceRolePromotable,
  VariationModule,
  VariationStep,
} from '@types';
import { components, constants, services, ui } from '@application';
import BoardSrc from '../images/board.svg';

const { Img } = ui;
const { Stepper, StepMove, EditorSidebarStepContainer } = components;
const {
  createStep,
  getSameMoveStep,
  createNotableMove,
  isLegalMove,
  parsePgn,
  getNextMoveIndex,
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
    state: { editing, move, orientation },
  } = step;
  const position = move?.position || step.state.position;

  if (editing || (step.state.steps.length === 0 && !newMove)) {
    // New position setup while there are no steps
    updateStep(
      updateStepState(step, {
        position: newPosition,
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
    // New piece dropped or removed or illegal move
    const newVariationStep = createStep('variation', {
      position: newPosition,
      orientation,
    });
    updateStep(addVariationStep(step, newVariationStep));
    setActiveStep(newVariationStep);
    return;
  }

  const nextMoveIndex = getNextMoveIndex(move, movedPiece.color);
  const notableMove = createNotableMove(
    newPosition,
    newMove,
    nextMoveIndex,
    movedPiece,
    captured,
    promoted,
  );

  const hasMoveStep = getLastStep(step, false)?.stepType === 'move';

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
    updateStep(addVariationStep(step, newMoveStep));
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
  updateChapter,
  stepRoot,
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
    (pgn: string) => {
      const games = parsePgn(pgn, { orientation });
      let updatedStepRoot = stepRoot;
      games.forEach(({ variation }) => {
        updatedStepRoot = addStep(updatedStepRoot, variation);
      });
      updateChapter(updatedStepRoot as Chapter);
    },
    [orientation, stepRoot, updateChapter],
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
  const {
    step,
    activeStep,
    updateStep,
    renderToolbox: StepToolbox,
    renderStepTag: StepTag,
    setActiveStep,
  } = props;
  const { description } = step.state;
  const handleComment =
    description === undefined
      ? () => updateStep(updateStepState(step, { description: '' }))
      : undefined;

  return (
    <>
      <EditorSidebarStepContainer
        className="no-gutters g-0"
        {...props}
        active={activeStep === step}
        showInput={description !== undefined}
        text={step.state.description}
        textChangeHandler={description =>
          updateStep(updateStepState(step, { description }))
        }
        onDeleteComment={() =>
          updateStep(
            updateStepState(step, {
              description: undefined,
            }),
          )
        }
      >
        <StepTag
          active={activeStep === step}
          onClick={() => setActiveStep(step)}
        >
          {step.state.move ? (
            <StepMove move={step.state.move} />
          ) : (
            <Img src={BoardSrc} style={{ background: '#ffffff' }} />
          )}
        </StepTag>
        <StepToolbox
          active={activeStep === step}
          step={step}
          comment={handleComment}
        />
      </EditorSidebarStepContainer>
      <Stepper {...props} stepRoot={step} />
    </>
  );
};

export { EditorBoard, EditorSidebar };
