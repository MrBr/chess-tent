import React, { ComponentProps, FormEvent, useMemo } from 'react';
import {
  Chapter,
  getChapterParentStep,
  getChapterPreviousStep,
  getChapterStep,
  getLessonChapter,
  Lesson,
  removeStep,
  Step,
} from '@chess-tent/models';
import { Action, Components, LessonUpdates } from '@types';
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
  actions: {
    updateLessonStep,
    addLessonChapter,
    updateLessonChapter,
    updateLessonState,
  },
} = state;
const {
  useDispatchBatched,
  useApi,
  useLocation,
  usePromptModal,
  useHistory,
} = hooks;

type EditorRendererProps = ComponentProps<Components['Editor']> & {
  activeChapter: Chapter;
  activeStep: Step;
  lessonUpdate: (lessonId: Lesson['id'], updates: LessonUpdates) => void;
  dispatch: (action: Action<any, any>) => void;
  history: ReturnType<typeof useHistory>;
  location: ReturnType<typeof useLocation>;
  promptModal: ReturnType<typeof usePromptModal>;
  lessonUpdateError: string | {} | null;
};
type EditorRendererState = { dirty: boolean };

/**
 * EditorRenderer is used to save handlers to the component instance.
 * There is really a lot of updates going on and it doesn't make sense to create callbacks all the time.
 */
class EditorRenderer extends React.Component<
  EditorRendererProps,
  EditorRendererState
> {
  state = {
    dirty: false,
  };

  componentDidUpdate(prevProps: EditorRendererProps) {
    const { lesson } = this.props;
    if (lesson !== prevProps.lesson) {
      this.setState({ dirty: true });
      this.lessonUpdateThrottle(lesson);
    }
  }

  setActiveStepHandler = (step: Step) => {
    const { history, activeChapter } = this.props;
    history.replace({
      ...services.history.location,
      search: `?activeStep=${step.id}&activeChapter=${activeChapter.id}`,
    });
  };

  setActiveChapterHandler = (chapter: Chapter) => {
    const { history } = this.props;
    history.replace({
      ...services.history.location,
      search: `?activeChapter=${chapter.id}`,
    });
  };

  lessonUpdateThrottle = debounce(
    (lesson: Lesson) =>
      this.props.lessonUpdate(lesson.id, getLessonUpdates(lesson)),
    5000,
    {
      trailing: true,
    },
  );

  updateLessonTitleDebounced = debounce(title => {
    const { lesson, dispatch } = this.props;
    const action = updateLessonState(lesson, 'title', title);
    addLessonUpdate(action);
    dispatch(action);
  }, 500);

  updateLessonTitle = (event: FormEvent<HTMLHeadingElement>) => {
    const elem = event.target as HTMLHeadingElement;
    // @ts-ignore
    if (event.nativeEvent.inputType === 'insertParagraph') {
      elem.innerText = elem.innerText.trim();
      elem.blur();
      return;
    }
    this.updateLessonTitleDebounced(elem.innerText);
  };

  updateStep = (step: Step) => {
    const { dispatch, lesson, activeChapter } = this.props;
    const action = updateLessonStep(lesson, activeChapter, step);
    addLessonUpdate(action);
    dispatch(action);
  };

  deleteStep = (step: Step) => {
    const { activeChapter, history } = this.props;
    const parentStep = getChapterParentStep(activeChapter, step);
    const newActiveStep = getChapterPreviousStep(activeChapter, step);
    if (!newActiveStep) {
      // Don't allow deleting first step (for now)
      return;
    }
    this.updateStep(removeStep(parentStep, step));
    history.replace({
      pathname: history.location.pathname,
      search: `?activeStep=${newActiveStep.id}`,
    });
  };

  updateChapter = (chapter: Chapter) => {
    const { dispatch, lesson } = this.props;
    const action = updateLessonChapter(lesson, chapter);
    addLessonUpdate(action);
    dispatch(action);
  };
  addNewChapter = () => {
    const { dispatch, history, lesson, location } = this.props;
    const newChapter = createChapter();
    const action = addLessonChapter(lesson, newChapter);
    addLessonUpdate(action);
    dispatch(action);
    history.push({
      pathname: location.pathname,
      search: 'activeChapter=' + newChapter.id,
    });
  };
  removeChapter = (chapter: Chapter) => {
    const { dispatch, history, lesson, location } = this.props;
    const newChapters = lesson.state.chapters.filter(
      ({ id }) => id !== chapter.id,
    );
    if (newChapters.length === 0) {
      // Don't allow deleting last chapter
      return;
    }
    const action = updateLessonState(lesson, 'chapters', newChapters);
    addLessonUpdate(action);
    dispatch(action);
    history.replace(location.pathname);
  };
  updateChapterTitle = (title: string) => {
    const { activeChapter } = this.props;
    this.updateChapter({
      ...activeChapter,
      state: {
        ...activeChapter.state,
        title,
      },
    });
  };

  render() {
    const {
      activeStep,
      lesson,
      promptModal,
      lessonUpdateError,
      activeChapter,
    } = this.props;
    const { dirty } = this.state;
    const lessonStatus = lessonUpdateError
      ? 'Error!'
      : dirty
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
              setActiveStep={this.setActiveStepHandler}
              lesson={lesson}
              status={lessonStatus}
              Chessboard={Chessboard}
              chapter={activeChapter}
              updateStep={this.updateStep}
              removeStep={this.deleteStep}
            />
          </Col>
          <Col sm={5} xl={4}>
            <Sidebar>
              <Button
                size="extra-small"
                className="mr-3"
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
                    <Headline2
                      contentEditable
                      dangerouslySetInnerHTML={{
                        __html: lesson.state.title,
                      }}
                      onInput={this.updateLessonTitle}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <ChaptersDropdown
                      activeChapter={activeChapter}
                      chapters={lesson.state.chapters}
                      onChange={this.setActiveChapterHandler}
                      onEdit={this.updateChapterTitle}
                      onNew={this.addNewChapter}
                      onRemove={this.removeChapter}
                    />
                  </Col>
                </Row>
              </Container>
              <Stepper
                lesson={lesson}
                steps={activeChapter.state.steps}
                activeStep={activeStep}
                setActiveStep={this.setActiveStepHandler}
                chapter={activeChapter}
                updateStep={this.updateStep}
                removeStep={this.deleteStep}
              />
            </Sidebar>
          </Col>
        </Row>
      </Container>
    );
  }
}

const Editor: Components['Editor'] = ({ lesson, save }) => {
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

  const promptModal = usePromptModal();
  const { fetch: lessonUpdate, error: lessonUpdateError } = useApi(save);

  return (
    <EditorRenderer
      lesson={lesson}
      lessonUpdate={lessonUpdate}
      lessonUpdateError={lessonUpdateError}
      activeChapter={activeChapter}
      activeStep={activeStep}
      dispatch={dispatch}
      location={location}
      history={history}
      promptModal={promptModal}
      save={save}
    />
  );
};

export default Editor;
