import React, { useCallback, useMemo } from 'react';
import { Step, getLessonPreviousStep } from '@chess-tent/models';
import { Components } from '@types';
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
const { getStepEndSetup } = stepModules;
const {
  actions: { setLessonActiveStep },
} = state;
const { useDispatchBatched } = hooks;
const { START_FEN } = constants;

const Editor: Components['Editor'] = ({ lesson }) => {
  const dispatch = useDispatchBatched();
  const { steps, activeStep } = lesson.state;

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

export default Editor;
