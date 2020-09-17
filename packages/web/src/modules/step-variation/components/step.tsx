import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  createStep as coreCreateStep,
  addStep,
  getLastStep,
  Lesson,
  Chapter,
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
  useUpdateLessonStepState,
} = hooks;
const { Stepper, StepTag, StepToolbox } = components;
const {
  actions: { updateLessonStepState, setLessonActiveStep, updateLessonStep },
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
  chapter: Chapter,
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
      updateLessonStepState(lesson, chapter, step, {
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
      updateLessonStep(lesson, chapter, addStep(step, newVariationStep)),
      setLessonActiveStep(lesson, newMoveStep),
    ];
  }

  return [
    updateLessonStep(lesson, chapter, addStep(step, newMoveStep)),
    setLessonActiveStep(lesson, newMoveStep),
  ];
};

const Editor: VariationModule['Editor'] = ({
  Chessboard,
  step,
  lesson,
  status,
  chapter,
}) => {
  const {
    state: { position, shapes, editing },
  } = step;
  const dispatch = useDispatchBatched();

  const toggleEditingMode = useCallback(
    () =>
      dispatch(
        updateLessonStepState(lesson, chapter, step, { editing: !editing }),
      ),
    [dispatch, lesson, chapter, step, editing],
  );

  const updateShapes = useCallback(
    (shapes: DrawShape[]) =>
      dispatch(updateLessonStepState(lesson, chapter, step, { shapes })),
    [chapter, dispatch, lesson, step],
  );

  const onChangeHandle = useCallback(
    (newPosition: FEN, newMove?: Move, movedPiece?: Piece) =>
      dispatch(
        ...boardChange(lesson, chapter, step, newPosition, newMove, movedPiece),
      ),
    [dispatch, lesson, chapter, step],
  );

  return (
    <Chessboard
      edit
      sparePieces
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
  Footer,
}) => {
  const {
    state: { position, shapes },
  } = step;
  return <Chessboard fen={position} shapes={shapes} footer={<Footer />} />;
};

const Exercise: VariationModule['Exercise'] = () => {
  return <>{'Variation'}</>;
};

const StepperStep: VariationModule['StepperStep'] = ({
  step,
  setActiveStep,
  activeStep,
  lesson,
  chapter,
  ...props
}) => {
  const updateStepState = useUpdateLessonStepState(lesson, chapter, step);
  const addDescriptionStep = useAddDescriptionStep(
    lesson,
    chapter,
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
            textChangeHandler={description => updateStepState({ description })}
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
        chapter={chapter}
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
