import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  createStep as coreCreateStep,
  getChapterParentStep,
  isLastStep,
  addStep,
  getChapterPreviousStep,
  Chapter,
  Step,
  updateStepState,
  addStepToLeft,
} from '@chess-tent/models';
import { FEN, Move, MoveModule, MoveStep, Piece, VariationStep } from '@types';
import { services, components, ui } from '@application';

const { Col, Row, Container } = ui;
const { getPiece } = services;
const {
  StepTag,
  StepToolbox,
  Stepper,
  StepperStepContainer,
  StepMove,
} = components;

const stepType = 'move';

const createStep = (
  id: string,
  prevPosition: FEN,
  initialState?: Partial<MoveStep['state']>,
) =>
  coreCreateStep<MoveStep>(id, stepType, {
    shapes: [],
    steps: [],
    position: prevPosition,
    moveIndex: 1,
    ...(initialState || {}),
  });

const boardChange = (
  chapter: Chapter,
  step: MoveStep,
  updateStep: (step: Step) => void,
  setActiveStep: (step: Step) => void,
  newPosition: FEN,
  newMove?: Move,
  movedPiece?: Piece,
  captured?: boolean,
) => {
  const {
    state: { move, position },
  } = step;
  if (!newMove || !movedPiece) {
    return;
  }

  if (!move) {
    // Resolve move index
    const prevStep = getChapterPreviousStep(chapter, step);
    let moveIndex;
    if (services.isStepType<VariationStep>(prevStep, 'variation')) {
      moveIndex = prevStep.state.moveIndex;
    } else if (services.isStepType<MoveStep>(prevStep, 'move')) {
      moveIndex =
        movedPiece.color === 'white'
          ? prevStep.state.moveIndex + 1
          : prevStep.state.moveIndex;
    }

    updateStep(
      updateStepState(step, {
        position: newPosition,
        move: newMove,
        moveIndex,
        movedPiece,
        captured,
      }),
    );
    return;
  }

  const moveIndex =
    movedPiece.color === 'white'
      ? step.state.moveIndex + 1
      : step.state.moveIndex;

  const previousPiece = getPiece(position, move[1]) as Piece;
  if (movedPiece.color === previousPiece.color) {
    // New example
    const newVariationStep = services.createStep<VariationStep>(
      'variation',
      newPosition,
      {
        editing: true,
        moveIndex,
      },
    );

    updateStep(addStep(step, newVariationStep));
    setActiveStep(newVariationStep);
    return;
  }

  const parentStep = getChapterParentStep(chapter, step) as VariationStep;
  if (!isLastStep(parentStep, step, false)) {
    // New variation
    const newVariationStep = services.createStep<VariationStep>(
      'variation',
      newPosition,
      {
        moveIndex,
      },
    );
    updateStep(addStep(step, newVariationStep));
    setActiveStep(newVariationStep);
    return;
  }

  const newMoveStep = services.createStep<MoveStep>('move', newPosition, {
    move: newMove,
    moveIndex: moveIndex,
    movedPiece,
    captured,
  });
  // Continuing the current variation
  updateStep(addStep(parentStep, newMoveStep));
  setActiveStep(newMoveStep);
};

const Editor: MoveModule['Editor'] = ({
  Chessboard,
  step,
  status,
  chapter,
  updateStep,
  setActiveStep,
}) => {
  const {
    state: { position, shapes },
  } = step;

  const updateShapes = useCallback(
    (shapes: DrawShape[]) => updateStep(updateStepState(step, { shapes })),
    [step, updateStep],
  );

  const onChangeHandle = useCallback(
    (newPosition: FEN, newMove: Move, movedPiece: Piece, captured: boolean) =>
      boardChange(
        chapter,
        step,
        updateStep,
        setActiveStep,
        newPosition,
        newMove,
        movedPiece,
        captured,
      ),
    [chapter, step, updateStep, setActiveStep],
  );

  return (
    <Chessboard
      edit
      sparePieces
      fen={position}
      onMove={onChangeHandle}
      header={status}
      onShapesChange={updateShapes}
      shapes={shapes}
    />
  );
};

const Playground: MoveModule['Playground'] = ({ Chessboard, step, Footer }) => {
  const {
    state: { position, shapes },
  } = step;
  return <Chessboard fen={position} shapes={shapes} footer={<Footer />} />;
};

const StepperStep: MoveModule['StepperStep'] = props => {
  const { step, setActiveStep, activeStep, updateStep, removeStep } = props;
  const addDescriptionStep = useCallback(() => {
    const descriptionStep = services.createStep(
      'description',
      step.state.position,
    );
    updateStep(addStepToLeft(step, descriptionStep));
    setActiveStep(descriptionStep);
  }, [setActiveStep, step, updateStep]);
  const removeMoveStep = useCallback(() => {
    removeStep(step);
  }, [step, removeStep]);
  const addExerciseStep = useCallback(() => {
    const exerciseStep = services.createStep('exercise', step.state.position);
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
            moveIndex={step.state.moveIndex}
            movedPiece={step.state.movedPiece}
          >
            <StepMove
              move={step.state.move}
              captured={step.state.captured}
              piece={step.state.movedPiece}
              index={step.state.moveIndex}
            />
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
      <StepperStepContainer>
        <Stepper {...props} steps={step.state.steps} />
      </StepperStepContainer>
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
