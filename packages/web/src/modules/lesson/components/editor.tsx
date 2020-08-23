import React, { useCallback, useEffect, useMemo } from 'react';
import { Step, getLessonPreviousStep } from '@chess-tent/models';
import { Components } from '@types';
import { debounce } from 'lodash';
import {
  state,
  hooks,
  constants,
  components,
  stepModules,
  ui,
  requests,
} from '@application';

const { Container, Row, Col } = ui;
const { Stepper, StepRenderer } = components;
const { getStepEndSetup } = stepModules;
const {
  actions: { setLessonActiveStep },
} = state;
const { useDispatchBatched, useApi, useComponentStateSilent } = hooks;
const { START_FEN } = constants;

const Editor: Components['Editor'] = ({ lesson }) => {
  const componentState = useComponentStateSilent();
  const dispatch = useDispatchBatched();
  const { steps, activeStep } = lesson.state;
  const { fetch: lessonSave, error: lessonSaveError } = useApi(
    requests.lessonSave,
  );
  const prevStep = lesson && getLessonPreviousStep(lesson, activeStep);
  const lessonSaveThrottle = useCallback(debounce(lessonSave, 1000), [fetch]);

  useEffect(() => {
    componentState.mounted && lessonSaveThrottle(lesson);
  }, [lesson, lessonSaveThrottle, componentState]);

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

  useEffect(() => {
    if (lessonSaveError) {
      alert('Lesson not saved!');
    }
  }, [lessonSaveError]);

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
