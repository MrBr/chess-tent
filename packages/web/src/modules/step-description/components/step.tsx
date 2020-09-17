import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  createStep as coreCreateStep,
  getChapterParentStep,
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
  actions: {
    updateLessonStepState,
    updateLessonStep: updateLessonStepAction,
    setLessonActiveStep,
  },
} = state;
const { Col, Row, Container } = ui;
const { StepTag, StepToolbox } = components;
const { useUpdateLessonStepState, useDispatchBatched } = hooks;

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
  ...props
}) => {
  const dispatch = useDispatchBatched();
  const updateShapes = useCallback(
    (shapes: DrawShape[]) =>
      dispatch(updateLessonStepState(lesson, chapter, step, { shapes })),
    [chapter, dispatch, lesson, step],
  );

  const parentStep = getChapterParentStep(chapter, step) as VariationStep;
  const ParentEditor = stepModules[parentStep.stepType].Editor;

  return (
    <ParentEditor
      {...props}
      lesson={lesson}
      step={parentStep}
      chapter={chapter}
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

const Exercise: DescriptionModule['Exercise'] = () => {
  return <>{'Description'}</>;
};

const StepperStep: DescriptionModule['StepperStep'] = ({
  step,
  setActiveStep,
  activeStep,
  lesson,
  chapter,
}) => {
  const dispatch = useDispatchBatched();
  const updateLessonStep = useUpdateLessonStepState(lesson, chapter, step);
  const addDescriptionStep = useCallback(() => {
    const parentStep = getChapterParentStep(chapter, step);
    const newDescriptionStep = services.createStep(
      'description',
      step.state.position,
    );
    dispatch(
      updateLessonStepAction(
        lesson,
        chapter,
        addStepRightToSame(parentStep, newDescriptionStep),
      ),
      setLessonActiveStep(lesson, newDescriptionStep),
    );
  }, [chapter, step, dispatch, lesson]);

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
            textChangeHandler={description => updateLessonStep({ description })}
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
