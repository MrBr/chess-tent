import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  Step,
  createStep as coreCreateStep,
  addStep,
  getLastStep,
} from '@chess-tent/models';
import { FEN, Move, Piece, StepModule } from '@types';
import { hooks, components, state, stepModules, ui } from '@application';
import Footer from './footer';

const { Container, Col, Row } = ui;
const {
  useDispatchBatched,
  useAddDescriptionStep,
  useUpdateStepDescriptionDebounced,
} = hooks;
const { Chessboard, Stepper, StepTag, StepToolbox } = components;
const {
  actions: { updateStepState, setLessonActiveStep, updateEntities },
} = state;

const stepType = 'variation';

type VariationStepState = {
  shapes: DrawShape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  steps: Step[];
  editing?: boolean;
};
type VariationStep = Step<VariationStepState, typeof stepType>;

type VariationModule = StepModule<VariationStep, typeof stepType>;

const createStep = (
  id: string,
  prevPosition: FEN,
  initialState?: Partial<VariationStep['state']>,
) =>
  coreCreateStep<VariationStep>(id, stepType, {
    shapes: [],
    steps: [],
    position: prevPosition,
    ...(initialState || {}),
  });

const getEndSetup: VariationModule['getEndSetup'] = ({
  state,
}: VariationStep) => ({
  position: state.position,
  shapes: state.shapes,
});

const changeReactor: VariationModule['changeReactor'] = (lesson, step) => (
  newPosition: FEN,
  newMove?: Move,
  movedPiece?: Piece,
) => {
  const {
    state: { editing },
  } = step;
  if (editing || !newMove || !movedPiece) {
    return [
      updateStepState(step, {
        position: newPosition,
        editing: true,
        steps: [],
      }),
    ];
  }

  const newMoveStep = stepModules.createStep('move', newPosition, {
    move: newMove,
  });

  const lastVariationStep = getLastStep(step);
  if (lastVariationStep?.stepType === 'move') {
    const newVariationStep = stepModules.createStep('variation', newPosition, {
      steps: [newMoveStep],
    });

    return [
      updateEntities(addStep(step, newVariationStep)),
      setLessonActiveStep(lesson, newMoveStep),
    ];
  }

  return [
    updateEntities(addStep(step, newMoveStep)),
    setLessonActiveStep(lesson, newMoveStep),
  ];
};

const shapesReactor: VariationModule['shapesReactor'] = (
  lesson,
  step,
) => shapes => [updateStepState(step, { shapes })];

const Editor: VariationModule['Editor'] = ({ step, lesson }) => {
  const {
    state: { position, shapes, editing },
  } = step;
  const dispatch = useDispatchBatched();

  const toggleEditingMode = useCallback(
    () => dispatch(updateStepState(step, { editing: !editing })),
    [dispatch, step, editing],
  );

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
      footer={
        <Footer toggleEditingMode={toggleEditingMode} editing={!!editing} />
      }
    />
  );
};

const Picker: VariationModule['Picker'] = () => {
  return <>Variation</>;
};

const Playground: VariationModule['Playground'] = ({ step, footer }) => {
  const {
    state: { position, shapes },
  } = step;
  return <Chessboard fen={position} shapes={shapes} footer={footer} />;
};

const Exercise: VariationModule['Exercise'] = () => {
  return <>{'Variation'}</>;
};

const StepperStep: VariationModule['StepperStep'] = ({
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
            Position
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

const Module: VariationModule = {
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
