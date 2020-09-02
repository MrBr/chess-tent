import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  Step,
  createStep as coreCreateStep,
  getLessonParentStep,
  isLastStep,
  addStep,
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
const { Chessboard, StepTag, StepToolbox, Stepper } = components;
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

const getEndSetup: MoveModule['getEndSetup'] = ({ state }: MoveStep) => ({
  position: state.position,
  shapes: state.shapes,
});

const changeReactor: MoveModule['changeReactor'] = (lesson, step) => (
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

const shapesReactor: MoveModule['shapesReactor'] = (lesson, step) => shapes => [
  updateStepState(step, { shapes }),
];

const Editor: MoveModule['Editor'] = ({ step, lesson }) => {
  const {
    state: { position, shapes },
  } = step;
  const dispatch = useDispatchBatched();

  const updateShapes = useCallback(
    (shapes: DrawShape[]) => dispatch(...shapesReactor(lesson, step)(shapes)),
    [dispatch, step, lesson],
  );

  const onChangeHandle = useCallback(
    (newPosition: FEN, newMove?: Move, movedPiece?: Piece) =>
      dispatch(
        ...changeReactor(lesson, step)(newPosition, newMove, movedPiece),
      ),
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

const Picker: MoveModule['Picker'] = () => {
  return <>Move</>;
};

const Playground: MoveModule['Playground'] = ({ step, footer }) => {
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
  Picker,
  Playground,
  Exercise,
  StepperStep,
  createStep,
  getEndSetup,
  stepType,
  changeReactor,
  shapesReactor,
};

export default Module;
