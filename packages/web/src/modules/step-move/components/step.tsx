import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  createStep as coreCreateStep,
  getLessonParentStep,
  isLastStep,
  addStep,
  Lesson,
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
    return [
      updateStepState(step, {
        position: newPosition,
        move: newMove,
      }),
    ];
  }

  const parentStep = getLessonParentStep(lesson, step) as MoveStep;
  const previousPiece = getPiece(position, move[1]) as Piece;
  const newMoveStep = services.createStep<MoveStep>('move', newPosition, {
    move: newMove,
  });

  if (movedPiece.color === previousPiece.color) {
    // New example
    const newVariationStep = services.createStep<VariationStep>(
      'variation',
      newPosition,
      {
        editing: true,
      },
    );
    return [
      updateEntities(addStep(step, newVariationStep)),
      setLessonActiveStep(lesson, newVariationStep),
    ];
  }

  if (!isLastStep(parentStep, step)) {
    // New variation
    const newVariationStep = services.createStep<VariationStep>(
      'variation',
      newPosition,
      {
        steps: [newMoveStep],
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
