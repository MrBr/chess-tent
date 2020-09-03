import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  Step,
  createStep as coreCreateStep,
  getLessonParentStep,
  addStepRightToSame,
} from '@chess-tent/models';
import { FEN, StepModule } from '@types';
import { components, hooks, state, stepModules, ui } from '@application';
import Comment from './comment';

const {
  actions: { updateStepState, updateEntities, setLessonActiveStep },
} = state;
const { Col, Row } = ui;
const { StepperStepContainer, StepTag, StepToolbox } = components;
const { useUpdateStepDescriptionDebounced, useDispatchBatched } = hooks;

const stepType = 'description';

type DescriptionStepState = {
  shapes: DrawShape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  steps: Step[];
};
type DescriptionStep = Step<DescriptionStepState, typeof stepType>;

type DescriptionModule = StepModule<DescriptionStep, typeof stepType>;

const createStep = (
  id: string,
  prevPosition: FEN,
  initialState?: Partial<DescriptionStep['state']>,
) =>
  coreCreateStep<DescriptionStep>(id, stepType, {
    shapes: [],
    steps: [],
    position: prevPosition,
    ...(initialState || {}),
  });

const Editor: DescriptionModule['Editor'] = ({
  Chessboard,
  step,
  lesson,
  ...props
}) => {
  const dispatch = useDispatchBatched();
  const updateShapes = useCallback(
    (shapes: DrawShape[]) => dispatch(updateStepState(step, { shapes })),
    [dispatch, step],
  );

  const parentStep = getLessonParentStep(lesson, step) as Step;
  const ParentEditor = stepModules.getStepModule(parentStep.stepType).Editor;

  return (
    <ParentEditor
      {...props}
      lesson={lesson}
      step={parentStep}
      Chessboard={props => (
        <Chessboard
          fen={props.fen}
          shapes={step.state.shapes}
          onShapesChange={updateShapes}
        />
      )}
    />
  );
};

const Playground: DescriptionModule['Playground'] = ({
  Chessboard,
  step,
  footer,
}) => {
  const {
    state: { position, shapes },
  } = step;
  return <Chessboard fen={position} shapes={shapes} footer={footer} />;
};

const Exercise: DescriptionModule['Exercise'] = () => {
  return <>{'Description'}</>;
};

const StepperStep: DescriptionModule['StepperStep'] = ({
  step,
  setActiveStep,
  activeStep,
  lesson,
}) => {
  const dispatch = useDispatchBatched();
  const updateDescriptionDebounced = useUpdateStepDescriptionDebounced(step);
  const addDescriptionStep = useCallback(() => {
    const parentStep = getLessonParentStep(lesson, step);
    const newDescriptionStep = stepModules.createStep(
      'description',
      step.state.position,
    );
    dispatch(
      updateEntities(addStepRightToSame(parentStep, newDescriptionStep)),
      setLessonActiveStep(lesson, newDescriptionStep),
    );
  }, [step, lesson, dispatch]);

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
            <Comment active={step === activeStep} />
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
    </StepperStepContainer>
  );
};

const Module: DescriptionModule = {
  Editor,
  Playground,
  Exercise,
  StepperStep,
  createStep,
  stepType,
};

export default Module;
