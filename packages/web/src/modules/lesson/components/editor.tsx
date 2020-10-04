import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Chapter,
  getChapterStep,
  getLessonChapter,
  Lesson,
  Step,
} from '@chess-tent/models';
import { Components } from '@types';
import { debounce } from 'lodash';
import { state, hooks, components, ui } from '@application';
import TrainingModal from './trening-assign';
import Sidebar from './sidebar';
import { PreviewModal } from './activity-preview';
import { addLessonUpdate, getLessonUpdates } from '../service';

const { Container, Row, Col, Headline2, Button, Dropdown } = ui;
const { Stepper, StepRenderer, Chessboard } = components;
const {
  actions: { setLessonActiveStep, updateLessonStep },
} = state;
const {
  useDispatchBatched,
  useApi,
  useComponentStateSilent,
  useLocation,
  usePromptModal,
} = hooks;

const Editor: Components['Editor'] = ({ lesson, save }) => {
  const componentState = useComponentStateSilent();
  const dispatch = useDispatchBatched();
  const { chapters } = lesson.state;
  const location = useLocation();
  const activeChapterId =
    new URLSearchParams(location.search).get('activeChapter') || chapters[0].id;

  const activeChapter = useMemo(
    () => getLessonChapter(lesson, activeChapterId),
    [lesson, activeChapterId],
  ) as Chapter;
  const activeStepId =
    new URLSearchParams(location.search).get('activeStep') ||
    activeChapter.state.steps[0].id;
  const activeStep = useMemo(
    () => getChapterStep(activeChapter, activeStepId),
    [activeChapter, activeStepId],
  ) as Step;

  const {
    state: { steps },
  } = activeChapter;
  const promptModal = usePromptModal();
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const {
    fetch: lessonUpdate,
    error: lessonUpdateError,
    response: lessonUpdated,
  } = useApi(save);
  const lessonUpdateThrottle = useCallback(
    debounce(
      (lesson: Lesson) => lessonUpdate(lesson.id, getLessonUpdates(lesson)),
      5000,
      {
        trailing: true,
      },
    ),
    [lessonUpdate],
  );
  const updateStep = useCallback(
    (step: Step) => {
      const action = updateLessonStep(lesson, activeChapter, step);
      addLessonUpdate(action);
      dispatch(action);
    },
    [activeChapter, dispatch, lesson],
  );

  useEffect(() => {
    if (componentState.mounted) {
      setIsDirty(true);
      lessonUpdateThrottle(lesson);
    }
  }, [lesson, lessonUpdateThrottle, componentState]);

  const setActiveStepHandler = useCallback(
    (step: Step) => {
      dispatch(setLessonActiveStep(lesson.id, step));
    },
    [dispatch, lesson.id],
  );

  useEffect(() => {
    setIsDirty(!!lessonUpdated?.error);
  }, [lessonUpdateError, lessonUpdated]);

  const lessonStatus = lessonUpdateError
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
            updateStep={updateStep}
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
            <Dropdown>
              <Dropdown.Toggle id="chapters">Chapter</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Chapter</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Stepper
              lesson={lesson}
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStepHandler}
              chapter={activeChapter}
              updateStep={updateStep}
            />
          </Sidebar>
        </Col>
      </Row>
    </Container>
  );
};

export default Editor;
