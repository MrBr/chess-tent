import React, { useCallback, useEffect } from 'react';
import { Step } from '@chess-tent/models';
import { Components } from '@types';
import { debounce } from 'lodash';
import { state, hooks, components, ui, requests } from '@application';
import styled from '@emotion/styled';

const { Container, Row, Col, Headline2 } = ui;
const { Stepper, StepRenderer, Chessboard } = components;
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

const StepperSidebar = styled.div({
  height: '100%',
  maxHeight: '100%',
  background: '#FAFBFB',
  overflowY: 'auto',
  padding: 24,
});

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
    <Container fluid className="px-0 h-100">
      <Row noGutters className="h-100">
        <Col>
          <StepRenderer<'Editor'>
            step={activeStep}
            component="Editor"
            activeStep={activeStep}
            setActiveStep={setActiveStepHandler}
            lesson={lesson}
            Chessboard={Chessboard}
          />
        </Col>
        <Col sm={4}>
          <StepperSidebar>
            <Headline2>Lesson</Headline2>
            <Stepper
              lesson={lesson}
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStepHandler}
            />
          </StepperSidebar>
        </Col>
      </Row>
    </Container>
  );
};

export default Editor;
