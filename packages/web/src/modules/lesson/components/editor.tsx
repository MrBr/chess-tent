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
import { services, state, hooks, components, ui } from '@application';
import TrainingModal from './trening-assign';
import Sidebar from './sidebar';
import { PreviewModal } from './activity-preview';
import ChaptersDropdown from './chapters-dropdown';
import { addLessonUpdate, getLessonUpdates } from '../service';

const { Container, Row, Col, Headline2, Button } = ui;
const { createChapter } = services;
const { Stepper, StepRenderer, Chessboard } = components;
const {
  actions: { updateLessonStep, addLessonChapter, updateLessonChapter },
} = state;
const {
  useDispatchBatched,
  useApi,
  useComponentStateSilent,
  useLocation,
  usePromptModal,
  useHistory,
} = hooks;

const Editor: Components['Editor'] = ({ lesson, save }) => {
  const componentState = useComponentStateSilent();
  const dispatch = useDispatchBatched();
  const { chapters } = lesson.state;
  const location = useLocation();
  const history = useHistory();
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
  const updateChapter = useCallback(
    (chapter: Chapter) => {
      const action = updateLessonChapter(lesson, chapter);
      addLessonUpdate(action);
      dispatch(action);
    },
    [dispatch, lesson],
  );
  const addNewChapter = useCallback(() => {
    const newChapter = createChapter();
    const action = addLessonChapter(lesson, newChapter);
    addLessonUpdate(action);
    dispatch(action);
    history.push(location.pathname + '?activeChapter=' + newChapter.id);
  }, [dispatch, history, lesson, location.pathname]);
  const updateChapterTitle = useCallback(
    (title: string) => {
      updateChapter({
        ...activeChapter,
        state: {
          ...activeChapter.state,
          title,
        },
      });
    },
    [updateChapter, activeChapter],
  );

  useEffect(() => {
    if (componentState.mounted) {
      setIsDirty(true);
      lessonUpdateThrottle(lesson);
    }
  }, [lesson, lessonUpdateThrottle, componentState]);

  const setActiveStepHandler = useCallback(
    (step: Step) => {
      history.replace({
        ...services.history.location,
        search: `?activeStep=${step.id}&activeChapter=${activeChapterId}`,
      });
    },
    [history, activeChapterId],
  );
  const setActiveChapterHandler = useCallback(
    (chapter: Chapter) => {
      history.replace({
        ...services.history.location,
        search: `?activeChapter=${chapter.id}`,
      });
    },
    [history],
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
            <Container>
              <Row>
                <Col>
                  <Headline2 contentEditable>Lesson</Headline2>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ChaptersDropdown
                    activeChapter={activeChapter}
                    chapters={chapters}
                    onChange={setActiveChapterHandler}
                    onEdit={updateChapterTitle}
                    onNew={addNewChapter}
                  />
                </Col>
              </Row>
            </Container>
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
