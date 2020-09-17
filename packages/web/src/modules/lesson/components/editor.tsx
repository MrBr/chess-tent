import React, { useCallback, useEffect, useState } from 'react';
import {
  Chapter,
  getChapterStep,
  getLessonChapter,
  Step,
} from '@chess-tent/models';
import { Components } from '@types';
import { debounce } from 'lodash';
import { state, hooks, components, ui, requests } from '@application';
import TrainingModal from './trening-assign';
import Sidebar from './sidebar';
import { PreviewModal } from './activity-preview';

const { Container, Row, Col, Headline2, Button } = ui;
const { Stepper, StepRenderer, Chessboard } = components;
const {
  actions: { setLessonActiveStep },
} = state;
const {
  useDispatchBatched,
  useApi,
  useComponentStateSilent,
  useLocation,
  usePromptModal,
} = hooks;

const Editor: Components['Editor'] = ({ lesson }) => {
  const componentState = useComponentStateSilent();
  const dispatch = useDispatchBatched();
  const { chapters } = lesson.state;
  const location = useLocation();
  const activeChapterId =
    new URLSearchParams(location.search).get('activeChapter') || chapters[0].id;
  const activeChapter = getLessonChapter(lesson, activeChapterId) as Chapter;
  const activeStepId =
    new URLSearchParams(location.search).get('activeStep') ||
    activeChapter.state.steps[0].id;
  const activeStep = getChapterStep(activeChapter, activeStepId) as Step;
  const {
    state: { steps },
  } = activeChapter;
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
            chapter={activeChapter}
          />
        </Col>
        <Col sm={5} xl={4}>
          <Sidebar>
            <Button
              size="extra-small"
              onClick={() =>
                promptModal(close => <TrainingModal close={close} />)
              }
            >
              Assign lesson
            </Button>
            <Button
              size="extra-small"
              onClick={() =>
                promptModal(close => (
                  <PreviewModal
                    close={close}
                    lesson={lesson}
                    step={activeStep}
                    chapter={activeChapter}
                  />
                ))
              }
            >
              Preview
            </Button>
            <Headline2>Lesson</Headline2>
            <Stepper
              lesson={lesson}
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStepHandler}
              chapter={activeChapter}
            />
          </Sidebar>
        </Col>
      </Row>
    </Container>
  );
};

export default Editor;
