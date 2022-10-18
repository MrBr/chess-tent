import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  addStep,
  updateStepState,
  getRightStep,
  getParentStep,
  StepRoot,
  replaceStep,
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
  PieceRolePromotable,
  Steps,
  VariationStep,
} from '@types';
import { services, components, constants } from '@application';

const { createNotableMove, createStepsFromNotableMoves, isLegalMove } =
  services;
const { StepTag, Stepper, StepMove, EditorSidebarStepContainer } = components;
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
  promoted?: PieceRolePromotable,
) => {
  const {
    state: { move, orientation, editing },
  } = step;

  if (editing) {
    updateStep(
      updateStepState(step, {
        move: {
          ...move,
          position: newPosition,
          move: newMove,
          promoted,
          captured,
          piece: movedPiece,
        },
      }),
    );
    return;
  }

  const moveIndex = services.getNextMoveIndex(move, movedPiece.color, true);

  const notableMove = createNotableMove(
    newPosition,
    newMove,
    moveIndex,
    movedPiece,
    captured,
    promoted,
  );

  if (!isLegalMove(move.position, newMove, promoted, true)) {
    // New example
    const newVariationStep = services.createStep('move', {
      move: notableMove,
      orientation,
    });

    updateStep(addStep(step, newVariationStep));
    setActiveStep(newVariationStep);
    return;
  }

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
      editing,
    },
  } = step;

  const updateEditing = useCallback(
    (editing: boolean) => updateStep(updateStepState(step, { editing })),
    [updateStep, step],
  );

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
      if (editing) {
        const parentStep = getParentStep(stepRoot, step) as VariationStep;
        // Keeping all the child steps, just replacing the current step type
        newVariation.state.steps = step.state.steps;
        if (parentStep.stepType === 'variation') {
          // This should always be the case
          updateStep(replaceStep(parentStep, step, newVariation));
        }
      } else {
        updateStep(addStep(step, newVariation));
      }
      setActiveStep(newVariation);
    },
    [editing, setActiveStep, step, stepRoot, updateStep],
  );

  const onChangeHandle = useCallback(
    (
      newPosition: FEN,
      newMove: Move,
      movedPiece: Piece,
      captured: boolean,
      promoted?: PieceRolePromotable,
    ) => {
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
    },
    [stepRoot, step, updateStep, setActiveStep],
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
      editing={editing}
      onUpdateEditing={updateEditing}
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
  const {
    step,
    activeStep,
    updateStep,
    renderToolbox: StepToolbox,
    setActiveStep,
  } = props;

  const { description } = step.state;
  const handleComment =
    description === undefined
      ? () => updateStep(updateStepState(step, { description: '' }))
      : undefined;
  const stepToolbox = (
    <StepToolbox
      active={activeStep === step}
      step={step}
      comment={handleComment}
    />
  );
  return (
    <>
      <EditorSidebarStepContainer
        {...props}
        active={activeStep === step}
        showInput={description !== undefined}
        text={step.state.description}
        textChangeHandler={description =>
          updateStep(
            updateStepState(step, {
              description,
            }),
          )
        }
        onDeleteComment={() =>
          updateStep(
            updateStepState(step, {
              description: undefined,
            }),
          )
        }
      >
        {stepToolbox}
        <StepTag
          active={activeStep === step}
          onClick={() => setActiveStep(step)}
        >
          <StepMove move={step.state.move} />
        </StepTag>
      </EditorSidebarStepContainer>
      <Stepper {...props} stepRoot={step} />
    </>
  );
};

export { EditorBoard, EditorSidebar };
