import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  createStep as coreCreateStep,
  getParentStep,
  addStepRightToSame,
  updateStepState,
} from '@chess-tent/models';
import { DescriptionModule, DescriptionStep, VariationStep } from '@types';
import { components, services, ui, stepModules } from '@application';
import Comment from './comment';

const { Col, Row, Container, Icon, Text } = ui;
const {
  StepTag,
  StepToolbox,
  LessonPlayground,
  LessonPlaygroundSidebar,
} = components;

const stepType = 'description';

const createStep: DescriptionModule['createStep'] = (id, initialState) =>
  coreCreateStep<DescriptionStep>(id, stepType, {
    shapes: [],
    steps: [],
    ...(initialState || {}),
  });

const Editor: DescriptionModule['Editor'] = ({
  Chessboard,
  step,
  updateStep,
  stepRoot,
  ...props
}) => {
  const updateShapes = useCallback(
    (shapes: DrawShape[]) => updateStep(updateStepState(step, { shapes })),
    [step, updateStep],
  );

  const parentStep = getParentStep(stepRoot, step) as VariationStep;
  const ParentEditor = stepModules[parentStep.stepType].Editor;

  return (
    <ParentEditor
      {...props}
      step={parentStep}
      stepRoot={stepRoot}
      updateStep={updateStep}
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
  Footer,
  lesson,
  chapter,
}) => {
  const {
    state: { position, shapes },
  } = step;
  return (
    <LessonPlayground
      board={<Chessboard fen={position} shapes={shapes} footer={<Footer />} />}
      sidebar={
        <LessonPlaygroundSidebar lesson={lesson} step={step} chapter={chapter}>
          <Icon type="comment" textual />
          <Text>{step.state.description}</Text>
        </LessonPlaygroundSidebar>
      }
    />
  );
};

const StepperStep: DescriptionModule['StepperStep'] = ({
  step,
  setActiveStep,
  activeStep,
  stepRoot,
  updateStep,
  removeStep,
}) => {
  const addDescriptionStep = useCallback(() => {
    const parentStep = getParentStep(stepRoot, step);
    const newDescriptionStep = services.createStep('description', {
      position: step.state.position,
    });
    updateStep(addStepRightToSame(parentStep, newDescriptionStep));
    setActiveStep(newDescriptionStep);
  }, [stepRoot, step, updateStep, setActiveStep]);
  const removeDescriptionStep = useCallback(() => {
    removeStep(step);
  }, [step, removeStep]);

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
            textChangeHandler={description =>
              updateStep(updateStepState(step, { description }))
            }
            addStepHandler={addDescriptionStep}
            deleteStepHandler={removeDescriptionStep}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Module: DescriptionModule = {
  Editor,
  Playground,
  StepperStep,
  createStep,
  stepType,
};

export default Module;
