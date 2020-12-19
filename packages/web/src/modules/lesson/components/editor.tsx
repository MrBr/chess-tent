import React, {
  ComponentProps,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Chapter,
  Difficulty,
  getParentStep,
  getPreviousStep,
  getLessonChapter,
  NormalizedLesson,
  removeStep,
  Step,
  Tag,
  getChildStep,
  TYPE_LESSON,
} from '@chess-tent/models';
import {
  Actions,
  ChessboardProps,
  Components,
  EditorSidebarProps,
  LessonStatus,
  LessonUpdatableAction,
  LessonUpdates,
} from '@types';
import { debounce } from 'lodash';
import { components, hooks, services, state, ui } from '@application';
import TrainingModal from './training-assign';
import Sidebar from './editor-sidebar';
import { PreviewModal } from './activity-preview';
import ChaptersDropdown from './chapters-dropdown';

const { Container, Row, Col, Headline2, Button, Absolute, Text } = ui;
const { createChapter } = services;
const {
  Stepper,
  StepRenderer,
  Chessboard,
  DifficultyDropdown,
  TagsSelect,
  StepToolbox,
} = components;
const {
  actions: {
    updateLessonStep,
    addLessonChapter,
    updateLessonChapter,
    updateLessonPath,
  },
} = state;
const {
  useDispatchBatched,
  useApi,
  useLocation,
  usePromptModal,
  useHistory,
  useTags,
  usePathUpdates,
} = hooks;

type EditorRendererProps = ComponentProps<Components['Editor']> & {
  activeChapter: Chapter;
  activeStep: Step;
  dispatch: (action: Actions) => void;
  history: ReturnType<typeof useHistory>;
  location: ReturnType<typeof useLocation>;
  promptModal: ReturnType<typeof usePromptModal>;
  lessonStatus: LessonStatus;
  tags: Tag[];
  addLessonUpdate: (action: LessonUpdatableAction) => void;
};
type EditorRendererState = {
  // Previous step and chapter instances
  history: { step: Step; chapter: Chapter }[];
};

/**
 * EditorRenderer is used to save handlers to the component instance.
 * There is really a lot of updates going on and it doesn't make sense to create callbacks all the time.
 */
class EditorRenderer extends React.Component<
  EditorRendererProps,
  EditorRendererState
> {
  state: EditorRendererState = {
    history: [],
  };
  updateHistory(history: EditorRendererState['history']) {
    this.setState({ history });
  }
  addLessonUpdate(action: LessonUpdatableAction) {
    const { addLessonUpdate } = this.props;
    addLessonUpdate(action);
  }

  undoUpdate = () => {
    const { lesson, activeStep, activeChapter } = this.props;
    const [prev, ...prevUpdates] = this.state.history;

    if (!prev) {
      return;
    }
    this.updateHistory(prevUpdates || []);

    const newStep = getChildStep(activeChapter, prev.step.id);
    if (
      getChildStep(newStep, activeStep.id) &&
      !getChildStep(prev.step, activeStep.id)
    ) {
      const prevStep = getPreviousStep(activeChapter, activeStep);
      this.setActiveStepHandler(prevStep);
    }

    const prevStep = getChildStep(prev.chapter, prev.step.id);
    const undoAction = updateLessonStep(lesson, prev.chapter, prevStep);
    this.addLessonUpdate(undoAction);
  };

  setActiveStepHandler = (step: Step) => {
    const { history, activeChapter } = this.props;
    history.replace({
      ...services.history.location,
      search: `?activeStep=${step.id}&activeChapter=${activeChapter.id}`,
    });
  };

  setActiveChapterHandler = (chapter: Chapter) => {
    const { history } = this.props;
    this.updateHistory([]);
    history.replace({
      ...services.history.location,
      search: `?activeChapter=${chapter.id}`,
    });
  };

  updateLessonTitleDebounced = debounce(title => {
    const { lesson } = this.props;
    const action = updateLessonPath(lesson, ['state', 'title'], title);
    this.addLessonUpdate(action);
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

  updateLessonDifficulty = (difficulty?: Difficulty) => {
    if (difficulty === undefined) {
      return;
    }

    const { lesson } = this.props;
    const action = updateLessonPath(lesson, ['difficulty'], difficulty);
    this.addLessonUpdate(action);
  };

  updateStep = (step: Step) => {
    const { lesson, activeChapter } = this.props;
    const { history } = this.state;
    const prevStep = getChildStep(activeChapter, step.id);
    this.updateHistory([
      { step: prevStep, chapter: activeChapter },
      ...history,
    ]);

    const action = updateLessonStep(lesson, activeChapter, step);

    this.addLessonUpdate(action);
  };

  deleteStep = (step: Step) => {
    const { activeChapter, history } = this.props;
    const parentStep = getParentStep(activeChapter, step);
    const newActiveStep = getPreviousStep(activeChapter, step);
    if (!newActiveStep) {
      // Don't allow deleting first step (for now)
      return;
    }
    this.updateStep(
      removeStep(parentStep, step, step.stepType !== 'variation'),
    );
    history.replace({
      pathname: history.location.pathname,
      search: `?activeStep=${newActiveStep.id}`,
    });
  };

  updateChapter = (chapter: Chapter) => {
    const { lesson } = this.props;
    const action = updateLessonChapter(lesson, chapter);
    this.addLessonUpdate(action);
  };
  addNewChapter = () => {
    const { lesson } = this.props;
    const newChapter = createChapter();
    const action = addLessonChapter(lesson, newChapter);
    this.addLessonUpdate(action);
    this.setActiveChapterHandler(newChapter);
  };
  removeChapter = (chapter: Chapter) => {
    const { history, lesson, location } = this.props;
    const newChapters = lesson.state.chapters.filter(
      ({ id }) => id !== chapter.id,
    );
    if (newChapters.length === 0) {
      // Don't allow deleting last chapter
      return;
    }
    const action = updateLessonPath(lesson, ['state', 'chapters'], newChapters);
    this.addLessonUpdate(action);
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
  updateTags = (tags: NormalizedLesson['tags']) => {
    const { lesson } = this.props;
    const action = updateLessonPath(lesson, ['tags'], tags);
    this.addLessonUpdate(action);
  };

  renderLessonStatus() {
    const { lessonStatus } = this.props;
    switch (lessonStatus) {
      case LessonStatus.DIRTY:
        return 'Have unsaved changes';
      case LessonStatus.ERROR:
        return 'Something went wrong, lesson not saved.';
      case LessonStatus.SAVED:
      case LessonStatus.INITIAL:
      default:
        return 'Lesson saved';
    }
  }

  renderChessboard = (props: ChessboardProps) => {
    return (
      <Chessboard
        {...props}
        header={
          <>
            {props.header}
            <Absolute right={20} top={20} onClick={this.undoUpdate}>
              Undo
            </Absolute>
          </>
        }
      />
    );
  };

  renderToolbox: EditorSidebarProps['renderToolbox'] = props => {
    return (
      <StepToolbox
        setActiveStep={this.setActiveStepHandler}
        updateStep={this.updateStep}
        removeStep={this.deleteStep}
        {...props}
      />
    );
  };

  render() {
    const {
      activeStep,
      lesson,
      promptModal,
      activeChapter,
      tags,
      history,
    } = this.props;
    const lessonStatusText = this.renderLessonStatus();

    return (
      <Container fluid className="px-0 h-100">
        <Absolute left={15} top={15} zIndex={100} className="cursor-pointer">
          <Text onClick={history.goBack}>Back</Text>
        </Absolute>
        <Row noGutters className="h-100">
          <Col className="pt-5">
            <StepRenderer
              step={activeStep}
              component="EditorBoard"
              activeStep={activeStep}
              setActiveStep={this.setActiveStepHandler}
              stepRoot={activeChapter}
              status={lessonStatusText}
              Chessboard={this.renderChessboard}
              updateStep={this.updateStep}
              removeStep={this.deleteStep}
            />
          </Col>
          <Col sm={5} xl={4} className="mh-100">
            <Sidebar>
              <Container>
                <Row>
                  <Col>
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
                  </Col>
                </Row>
                <Row className="mt-3 mb-3">
                  <Col className="col-auto">
                    <DifficultyDropdown
                      id="editor-difficulty"
                      includeNullOption={false}
                      initial={lesson.difficulty}
                      onChange={this.updateLessonDifficulty}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TagsSelect
                      tags={tags}
                      selected={lesson.tags}
                      onChange={this.updateTags}
                    />
                  </Col>
                </Row>
              </Container>
              <Container>
                <Row>
                  <Col>
                    <Headline2
                      contentEditable
                      dangerouslySetInnerHTML={{
                        __html: lesson.state.title,
                      }}
                      onInput={this.updateLessonTitle}
                      className="mt-4"
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col>
                    <ChaptersDropdown
                      editable
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
                activeStep={activeStep}
                setActiveStep={this.setActiveStepHandler}
                stepRoot={activeChapter}
                updateStep={this.updateStep}
                removeStep={this.deleteStep}
                root
                renderToolbox={this.renderToolbox}
              />
            </Sidebar>
          </Col>
        </Row>
      </Container>
    );
  }
}

const Editor: Components['Editor'] = ({ lesson, save, onStatusChange }) => {
  const dispatch = useDispatchBatched();
  const { chapters } = lesson.state;
  const location = useLocation();
  const history = useHistory();
  const tags = useTags();
  const {
    fetch: lessonUpdate,
    error: lessonUpdateError,
    response: lessonUpdateResponse,
    reset: lessonUpdateReset,
  } = useApi(save);
  const [lessonStatus, setLessonStatus] = useState<LessonStatus>(
    LessonStatus.INITIAL,
  );
  const pushUpdate = usePathUpdates(
    TYPE_LESSON,
    lesson.id,
    (updates: LessonUpdates) => {
      lessonUpdate(lesson.id, updates);
    },
  );

  const activeChapterId =
    new URLSearchParams(location.search).get('activeChapter') || chapters[0].id;
  const activeChapter = useMemo(
    () => getLessonChapter(lesson, activeChapterId),
    [lesson, activeChapterId],
  ) as Chapter;
  const activeStepId =
    new URLSearchParams(location.search).get('activeStep') ||
    activeChapter.state.steps[0].id;
  const activeStep = useMemo(() => getChildStep(activeChapter, activeStepId), [
    activeChapter,
    activeStepId,
  ]) as Step;

  useEffect(() => {
    onStatusChange && onStatusChange(lessonStatus);
  }, [lessonStatus, onStatusChange]);

  useEffect(() => {
    if (lessonUpdateError && lessonStatus !== LessonStatus.ERROR) {
      setLessonStatus(LessonStatus.ERROR);
    } else if (lessonUpdateResponse && lessonStatus !== LessonStatus.SAVED) {
      setLessonStatus(LessonStatus.SAVED);
    } else {
      // All saved, clear state for next change
      lessonUpdateReset();
    }
  }, [
    lessonStatus,
    lessonUpdateError,
    lessonUpdateReset,
    lessonUpdateResponse,
  ]);

  const handleLessonUpdate = useCallback(
    action => {
      setLessonStatus(LessonStatus.DIRTY);
      pushUpdate(action);
      dispatch(action);
    },
    [dispatch, pushUpdate],
  );

  const promptModal = usePromptModal();

  return (
    <EditorRenderer
      lesson={lesson}
      lessonStatus={lessonStatus}
      activeChapter={activeChapter}
      activeStep={activeStep}
      dispatch={dispatch}
      location={location}
      history={history}
      promptModal={promptModal}
      save={save}
      tags={tags}
      addLessonUpdate={handleLessonUpdate}
    />
  );
};

export default Editor;
