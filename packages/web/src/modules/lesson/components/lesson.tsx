import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Lesson,
  Step,
  createLesson,
  getLessonPreviousStep,
  User,
} from '@chess-tent/models';
import { AppState } from '@types';
import {
  state,
  hooks,
  constants,
  components,
  stepModules,
  ui,
} from '@application';

const { Container, Row, Col } = ui;
const { Stepper, StepRenderer } = components;
const { createStep, getStepEndSetup } = stepModules;
const {
  selectors: { lessonSelector },
  actions: { setLessonActiveStep, updateEntities },
} = state;
const { useDispatchBatched } = hooks;
const { START_FEN } = constants;

const LessonComponent = () => {
  const dispatch = useDispatchBatched();

  useEffect(() => {
    const defaultStep: Step = createStep('variation', START_FEN);
    const defaultLesson: Lesson = createLesson(
      '1',
      [defaultStep],
      defaultStep,
      { id: '1' } as User,
    );
    dispatch(updateEntities(defaultLesson));
  }, [dispatch]);
  const lesson = useSelector<AppState, Lesson>(lessonSelector('1'));
  const { steps, activeStep } = lesson?.state || {};

  const prevStep = lesson && getLessonPreviousStep(lesson, activeStep);

  const prevPosition = useMemo(
    () => (prevStep ? getStepEndSetup(prevStep).position : START_FEN),
    [prevStep],
  );

  const setActiveStep = useCallback(
    (step: Step) => {
      dispatch(setLessonActiveStep(lesson, step));
    },
    [dispatch, lesson],
  );

  return (
    <>
      <Container fluid>
        <Row noGutters>
          <Col>
            {activeStep && (
              <StepRenderer
                step={activeStep}
                component="Editor"
                prevPosition={prevPosition}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                lesson={lesson}
              />
            )}
          </Col>
          <Col sm={3}>
            <h1>Lesson</h1>
            <Stepper
              lesson={lesson}
              steps={steps}
              activeStep={activeStep}
              prevPosition={prevPosition}
              setActiveStep={setActiveStep}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LessonComponent;
