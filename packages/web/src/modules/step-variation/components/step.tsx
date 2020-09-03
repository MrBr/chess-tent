import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  Step,
  createStep as coreCreateStep,
  addStep,
  getLastStep,
  Lesson,
} from '@chess-tent/models';
import { FEN, Move, Piece, StepModule } from '@types';
import { hooks, components, state, stepModules, ui } from '@application';
import Footer from './footer';

const { Col, Row } = ui;
const {
  useDispatchBatched,
  useAddDescriptionStep,
  useUpdateStepDescriptionDebounced,
} = hooks;
const { Stepper, StepTag, StepToolbox, StepperStepContainer } = components;
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

const Editor: VariationModule['Editor'] = ({ Chessboard, step, lesson }) => {
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
      onChange={onChangeHandle}
      onShapesChange={updateShapes}
      shapes={shapes}
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
    <StepperStepContainer onClick={handleStepClick}>
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
    </StepperStepContainer>
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
