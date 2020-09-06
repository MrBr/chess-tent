import React, { useCallback, useEffect, useState } from 'react';
import { Step } from '@chess-tent/models';
import { Components } from '@types';
import { debounce } from 'lodash';
import { state, hooks, components, ui, requests } from '@application';
import styled from '@emotion/styled';
import TrainingModal from './trening-assign';

const { Container, Row, Col, Headline2, Button } = ui;
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
  useLocation,
  usePromptModal,
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
  const { steps } = lesson.state;
  const location = useLocation();
  const activeStepId =
    new URLSearchParams(location.search).get('activeStep') ||
    lesson.state.steps[0].id;
  const activeStep = useSelector(stepSelector(activeStepId)) as Step;
  const promptModal = usePromptModal();
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const {
    fetch: lessonSave,
    error: lessonSaveError,
    response: lessonSaved,
  } = useApi(requests.lessonSave);
  const lessonSaveThrottle = useCallback(debounce(lessonSave, 1000), [
    lessonSave,
  ]);

  useEffect(() => {
    if (componentState.mounted) {
      setIsDirty(true);
      lessonSaveThrottle(lesson);
    }
  }, [lesson, lessonSaveThrottle, componentState]);

  const setActiveStepHandler = useCallback(
    (step: Step) => {
      dispatch(setLessonActiveStep(lesson, step));
    },
    [dispatch, lesson],
  );

  useEffect(() => {
    setIsDirty(!!lessonSaved?.error);
  }, [lessonSaveError, lessonSaved]);

  const lessonStatus = lessonSaveError
    ? 'Error!'
    : isDirty
    ? 'Have unsaved changes'
    : 'Lesson saved';

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
            status={lessonStatus}
            Chessboard={Chessboard}
          />
        </Col>
        <Col sm={4}>
          <StepperSidebar>
            <Button
              size="extra-small"
              onClick={() => promptModal(<TrainingModal />)}
            >
              Assign lesson
            </Button>
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
