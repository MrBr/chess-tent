import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  Step,
  createStep as coreCreateStep,
  getLessonParentStep,
  isLastStep,
  addStep,
  Lesson,
} from '@chess-tent/models';
import { FEN, Move, Piece, StepModule } from '@types';
import {
  services,
  hooks,
  components,
  state,
  stepModules,
  ui,
} from '@application';

const { Container, Col, Row } = ui;
const { getPiece } = services;
const {
  useDispatchBatched,
  useAddDescriptionStep,
  useUpdateStepDescriptionDebounced,
} = hooks;
const { StepTag, StepToolbox, Stepper } = components;
const {
  actions: { updateStepState, updateEntities, setLessonActiveStep },
} = state;

const stepType = 'move';

type MoveStepState = {
  shapes: DrawShape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  move?: Move;
  steps: Step[];
};

type MoveStep = Step<MoveStepState, typeof stepType>;

type MoveModule = StepModule<MoveStep, typeof stepType>;

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
  const newMoveStep = stepModules.createStep('move', newPosition, {
    move: newMove,
  });

  if (movedPiece.color === previousPiece.color) {
    // New example
    const newVariationStep = stepModules.createStep('variation', newPosition, {
      editing: true,
    });
    return [
      updateEntities(addStep(step, newVariationStep)),
      setLessonActiveStep(lesson, newVariationStep),
    ];
  }

  if (!isLastStep(parentStep, step)) {
    // New variation
    const newVariationStep = stepModules.createStep('variation', newPosition, {
      steps: [newMoveStep],
    });
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
    <Container onClick={handleStepClick}>
      <Row>
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
    </Container>
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
