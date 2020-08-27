import React, { useCallback, useEffect } from 'react';
import { Step } from '@chess-tent/models';
import { Components } from '@types';
import { debounce } from 'lodash';
import { state, hooks, components, ui, requests } from '@application';

const { Container, Row, Col } = ui;
const { Stepper, StepRenderer } = components;
const {
  actions: { setLessonActiveStep },
  selectors: { stepSelector },
} = state;
const {
  useSelector,
  useDispatchBatched,
  useApi,
  useComponentStateSilent,
} = hooks;

const Editor: Components['Editor'] = ({ lesson }) => {
  const componentState = useComponentStateSilent();
  const dispatch = useDispatchBatched();
  const { steps, activeStepId } = lesson.state;
  const activeStep = useSelector(stepSelector(activeStepId));
  const { fetch: lessonSave, error: lessonSaveError } = useApi(
    requests.lessonSave,
  );
  const lessonSaveThrottle = useCallback(debounce(lessonSave, 1000), [fetch]);

  useEffect(() => {
    componentState.mounted && lessonSaveThrottle(lesson);
  }, [lesson, lessonSaveThrottle, componentState]);

  const setActiveStepHandler = useCallback(
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
            <StepRenderer<'Editor'>
              step={activeStep}
              component="Editor"
              activeStep={activeStep}
              setActiveStep={setActiveStepHandler}
              lesson={lesson}
            />
          </Col>
          <Col sm={3}>
            <h1>Lesson</h1>
            <Stepper
              lesson={lesson}
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStepHandler}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Editor;
