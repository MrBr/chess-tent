import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  createStep as coreCreateStep,
  getLessonParentStep,
  isLastStep,
  addStep,
  Lesson,
  getLessonPreviousStep,
} from '@chess-tent/models';
import { FEN, Move, MoveModule, MoveStep, Piece, VariationStep } from '@types';
import { services, hooks, components, state, ui } from '@application';

const { Col, Row } = ui;
const { getPiece } = services;
const {
  useDispatchBatched,
  useAddDescriptionStep,
  useUpdateStepDescriptionDebounced,
} = hooks;
const { StepTag, StepToolbox, Stepper, StepperStepContainer } = components;
const {
  actions: { updateStepState, updateEntities, setLessonActiveStep },
} = state;

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
  lesson: Lesson,
  step: MoveStep,
  newPosition: FEN,
  newMove?: Move,
  movedPiece?: Piece,
) => {
  const {
    state: { move, position },
  } = step;
  if (!newMove || !movedPiece) {
    return [];
  }

  if (!move) {
    // Resolve move index
    const prevStep = getLessonPreviousStep(lesson, step);
    let moveIndex;
    if (services.isStepType<VariationStep>(prevStep, 'variation')) {
      moveIndex = prevStep.state.moveIndex;
    } else if (services.isStepType<MoveStep>(prevStep, 'move')) {
      moveIndex =
        movedPiece.color === 'white'
          ? prevStep.state.moveIndex + 1
          : prevStep.state.moveIndex;
    }

    return [
      updateStepState(step, {
        position: newPosition,
        move: newMove,
        moveIndex,
        movedPiece,
      }),
    ];
  }

  const moveIndex =
    movedPiece.color === 'white'
      ? step.state.moveIndex + 1
      : step.state.moveIndex;
  const parentStep = getLessonParentStep(lesson, step) as VariationStep;
  const previousPiece = getPiece(position, move[1]) as Piece;
  const newMoveStep = services.createStep<MoveStep>('move', newPosition, {
    move: newMove,
    moveIndex: moveIndex,
    movedPiece,
  });

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
    return [
      updateEntities(addStep(step, newVariationStep)),
      setLessonActiveStep(lesson, newVariationStep),
    ];
  }

  if (!isLastStep(parentStep, step, false)) {
    // New variation
    const newVariationStep = services.createStep<VariationStep>(
      'variation',
      newPosition,
      {
        steps: [newMoveStep],
        moveIndex,
      },
    );
    return [
      updateEntities(addStep(step, newVariationStep)),
      setLessonActiveStep(lesson, newMoveStep),
    ];
  }

  // Continuing the current variation
  return [
    updateEntities(addStep(parentStep, newMoveStep)),
    setLessonActiveStep(lesson, newMoveStep),
  ];
};

const Editor: MoveModule['Editor'] = ({ Chessboard, step, lesson }) => {
  const {
    state: { position, shapes },
  } = step;
  const dispatch = useDispatchBatched();

  const updateShapes = useCallback(
    (shapes: DrawShape[]) => dispatch(updateStepState(step, { shapes })),
    [dispatch, step],
  );

  const onChangeHandle = useCallback(
    (newPosition: FEN, newMove?: Move, movedPiece?: Piece) =>
      dispatch(...boardChange(lesson, step, newPosition, newMove, movedPiece)),
    [dispatch, step, lesson],
  );

  return (
    <Chessboard
      fen={position}
      onChange={onChangeHandle}
      onShapesChange={updateShapes}
      shapes={shapes}
    />
  );
};

const Playground: MoveModule['Playground'] = ({ Chessboard, step, footer }) => {
  const {
    state: { position, shapes },
  } = step;
  return <Chessboard fen={position} shapes={shapes} footer={footer} />;
};

const Exercise: MoveModule['Exercise'] = () => {
  return <>{'Move'}</>;
};

const StepperStep: MoveModule['StepperStep'] = ({
  step,
  setActiveStep,
  activeStep,
  lesson,
  ...props
}) => {
  const updateDescriptionDebounced = useUpdateStepDescriptionDebounced(step);
  const addDescriptionStep = useAddDescriptionStep(
    lesson,
    step,
    step.state.position,
  );
  const handleStepClick = useCallback(
    event => {
      event.stopPropagation();
      activeStep !== step && setActiveStep(step);
    },
    [step, activeStep, setActiveStep],
  );

  return (
    <StepperStepContainer onClick={handleStepClick}>
      <Row noGutters>
        <Col className="col-auto">
          <StepTag step={step} active={activeStep === step}>
            {step.state.movedPiece?.color === 'white'
              ? step.state.moveIndex
              : '..'}
            {step.state.move}
          </StepTag>
        </Col>
        <Col>
          <StepToolbox
            text={step.state.description}
            active={activeStep === step}
            textChangeHandler={updateDescriptionDebounced}
            addStepHandler={addDescriptionStep}
          />
        </Col>
      </Row>
      <Stepper
        {...props}
        activeStep={activeStep}
        steps={step.state.steps}
        setActiveStep={setActiveStep}
        lesson={lesson}
      />
    </StepperStepContainer>
  );
};

const Module: MoveModule = {
  Editor,
  Playground,
  Exercise,
  StepperStep,
  createStep,
  stepType,
};

export default Module;
