import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  createStep as coreCreateStep,
  getChapterParentStep,
  addStepRightToSame,
  updateStepState,
} from '@chess-tent/models';
import { DescriptionModule, DescriptionStep, FEN, VariationStep } from '@types';
import { components, services, ui, stepModules } from '@application';
import Comment from './comment';

const { Col, Row, Container } = ui;
const { StepTag, StepToolbox } = components;

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
  chapter,
  updateStep,
  ...props
}) => {
  const updateShapes = useCallback(
    (shapes: DrawShape[]) => updateStep(updateStepState(step, { shapes })),
    [step, updateStep],
  );

  const parentStep = getChapterParentStep(chapter, step) as VariationStep;
  const ParentEditor = stepModules[parentStep.stepType].Editor;

  return (
    <ParentEditor
      {...props}
      lesson={lesson}
      step={parentStep}
      chapter={chapter}
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
}) => {
  const {
    state: { position, shapes },
  } = step;
  return <Chessboard fen={position} shapes={shapes} footer={<Footer />} />;
};

const StepperStep: DescriptionModule['StepperStep'] = ({
  step,
  setActiveStep,
  activeStep,
  chapter,
  updateStep,
}) => {
  const addDescriptionStep = useCallback(() => {
    const parentStep = getChapterParentStep(chapter, step);
    const newDescriptionStep = services.createStep(
      'description',
      step.state.position,
    );
    updateStep(addStepRightToSame(parentStep, newDescriptionStep));
    setActiveStep(newDescriptionStep);
  }, [chapter, step, updateStep, setActiveStep]);

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
