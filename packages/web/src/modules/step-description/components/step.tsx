import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  createStep as coreCreateStep,
  getLessonParentStep,
  addStepRightToSame,
} from '@chess-tent/models';
import { DescriptionModule, DescriptionStep, FEN, VariationStep } from '@types';
import {
  components,
  hooks,
  state,
  services,
  ui,
  stepModules,
} from '@application';
import Comment from './comment';

const {
  actions: { updateStepState, updateEntities, setLessonActiveStep },
} = state;
const { Col, Row, Container } = ui;
const { StepTag, StepToolbox } = components;
const { useUpdateStepDescriptionDebounced, useDispatchBatched } = hooks;

const stepType = 'description';

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

  const parentStep = getLessonParentStep(lesson, step) as VariationStep;
  const ParentEditor = stepModules[parentStep.stepType].Editor;

  return (
    <ParentEditor
      {...props}
      lesson={lesson}
      step={parentStep}
      Chessboard={props => (
        <Chessboard
          {...props}
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
    const newDescriptionStep = services.createStep(
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
    <Container onClick={handleStepClick} fluid className="p-0">
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
    </Container>
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
