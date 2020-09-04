import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  createStep as coreCreateStep,
  addStep,
  getLastStep,
  Lesson,
} from '@chess-tent/models';
import {
  FEN,
  Move,
  MoveStep,
  Piece,
  VariationModule,
  VariationStep,
} from '@types';
import { hooks, components, state, services, ui } from '@application';
import Footer from './footer';

const { Col, Row, Container } = ui;
const {
  useDispatchBatched,
  useAddDescriptionStep,
  useUpdateStepDescriptionDebounced,
} = hooks;
const { Stepper, StepTag, StepToolbox } = components;
const {
  actions: { updateStepState, setLessonActiveStep, updateEntities },
} = state;

const stepType = 'variation';

const createStep = (
  id: string,
  prevPosition: FEN,
  initialState?: Partial<VariationStep['state']>,
) =>
  coreCreateStep<VariationStep>(id, stepType, {
    shapes: [],
    steps: [],
    position: prevPosition,
    moveIndex: 1,
    ...(initialState || {}),
  });

const boardChange = (
  lesson: Lesson,
  step: VariationStep,
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

  const newMoveStep = services.createStep<MoveStep>('move', newPosition, {
    move: newMove,
    movedPiece,
    moveIndex: step.state.moveIndex,
  });

  const lastVariationStep = getLastStep(step, false);
  if (lastVariationStep?.stepType === 'move') {
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

  return [
    updateEntities(addStep(step, newMoveStep)),
    setLessonActiveStep(lesson, newMoveStep),
  ];
};

const Editor: VariationModule['Editor'] = ({
  Chessboard,
  step,
  lesson,
  status,
}) => {
  const {
    state: { position, shapes, editing },
  } = step;
  const dispatch = useDispatchBatched();

  const toggleEditingMode = useCallback(
    () => dispatch(updateStepState(step, { editing: !editing })),
    [dispatch, step, editing],
  );

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
      onMove={onChangeHandle}
      onShapesChange={updateShapes}
      shapes={shapes}
      header={status}
      footer={
        <Footer toggleEditingMode={toggleEditingMode} editing={!!editing} />
      }
    />
  );
};

const Playground: VariationModule['Playground'] = ({
  Chessboard,
  step,
  footer,
}) => {
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
    <Container onClick={handleStepClick} fluid className="p-0">
      <Row className="no-gutters">
        <Col className="col-auto">
          <StepTag step={step} active={activeStep === step}>
            fen
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
  Playground,
  Exercise,
  StepperStep,
  createStep,
  stepType,
};

export default Module;
