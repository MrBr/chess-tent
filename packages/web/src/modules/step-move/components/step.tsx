import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  createStep as coreCreateStep,
  addStep,
  Step,
  updateStepState,
  addStepToLeft,
  getRightStep,
  getParentStep,
  StepRoot,
} from '@chess-tent/models';
import { FEN, Move, MoveModule, MoveStep, Piece, VariationStep } from '@types';
import { services, components, ui } from '@application';

const { Col, Row, Container, Text } = ui;
const { getPiece, createNotableMove } = services;
const {
  StepTag,
  StepToolbox,
  Stepper,
  StepMove,
  LessonPlayground,
  LessonPlaygroundSidebar,
} = components;

const stepType = 'move';

const createStep: MoveModule['createStep'] = (id, initialState) =>
  coreCreateStep<MoveStep>(id, stepType, {
    shapes: [],
    steps: [],
    ...initialState,
  });

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

const Editor: MoveModule['Editor'] = ({
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
  const onPieceAddRemove = useCallback(
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
      edit
      sparePieces
      fen={position}
      onMove={onChangeHandle}
      onPieceRemove={onPieceAddRemove}
      onPieceDrop={onPieceAddRemove}
      header={status}
      onShapesChange={updateShapes}
      shapes={shapes}
    />
  );
};

const Playground: MoveModule['Playground'] = ({
  Chessboard,
  step,
  Footer,
  lesson,
  chapter,
}) => {
  const {
    state: {
      move: { position },
      shapes,
    },
  } = step;
  return (
    <LessonPlayground
      board={<Chessboard fen={position} shapes={shapes} footer={<Footer />} />}
      sidebar={
        <LessonPlaygroundSidebar lesson={lesson} step={step} chapter={chapter}>
          {step.state.move && <StepMove move={step.state.move} />}
          <Text>{step.state.description}</Text>
        </LessonPlaygroundSidebar>
      }
    />
  );
};

const StepperStep: MoveModule['StepperStep'] = props => {
  const { step, setActiveStep, activeStep, updateStep, removeStep } = props;
  const addDescriptionStep = useCallback(() => {
    const descriptionStep = services.createStep('description', {
      position: step.state.move.position,
    });
    updateStep(addStepToLeft(step, descriptionStep));
    setActiveStep(descriptionStep);
  }, [setActiveStep, step, updateStep]);
  const removeMoveStep = useCallback(() => {
    removeStep(step);
  }, [step, removeStep]);
  const addExerciseStep = useCallback(() => {
    const exerciseStep = services.createStep('exercise', {
      position: step.state.move.position,
    });
    updateStep(addStep(step, exerciseStep));
    setActiveStep(exerciseStep);
  }, [setActiveStep, step, updateStep]);

  const handleStepClick = useCallback(
    event => {
      event.stopPropagation();
      activeStep !== step && setActiveStep(step);
    },
    [step, activeStep, setActiveStep],
  );

  return (
    <Container fluid onClick={handleStepClick} className="p-0">
      <Row noGutters>
        <Col className="col-auto">
          <StepTag
            step={step}
            active={activeStep === step}
            move={step.state.move}
          >
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
            addStepHandler={addDescriptionStep}
            addExerciseHandler={addExerciseStep}
            deleteStepHandler={removeMoveStep}
          />
        </Col>
      </Row>
      <Stepper {...props} steps={step.state.steps} />
    </Container>
  );
};

const Module: MoveModule = {
  Editor,
  Playground,
  StepperStep,
  createStep,
  stepType,
};

export default Module;
