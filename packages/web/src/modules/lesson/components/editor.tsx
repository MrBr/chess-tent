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
  isStep,
  updateStepState,
  LessonDetailsStatus,
} from '@chess-tent/models';
import {
  Actions,
  ChessboardProps,
  Components,
  EditorContext,
  EditorSidebarProps,
  LessonStatus,
  LessonUpdatableAction,
  LessonUpdates,
  PieceColor,
  Steps,
} from '@types';
import { debounce, last, isEmpty } from 'lodash';
import { components, hooks, services, state, ui, utils } from '@application';
import TrainingModal from './training-assign';
import CollaboratorModal from './lesson-users';
import Sidebar from './editor-sidebar';
import { PreviewModal } from './activity-preview';
import ChaptersDropdown from './chapters-dropdown';
import RootStepButton from './editor-sidebar-root-step-button';
import { getDiff } from '../../utils/utils';

const { Container, Row, Col, Headline2, Button, Absolute, Text } = ui;
const { createChapter } = services;
const { downloadAs } = utils;
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
    updateLessonStatus,
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
  activeStep: Steps;
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
  history: {
    undoAction: LessonUpdatableAction;
    activeStepId: Step['id'];
    activeChapterId: Chapter['id'];
  }[];
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

  recordHistoryChange(undoAction: LessonUpdatableAction) {
    const { activeStep, activeChapter } = this.props;
    this.updateHistory([
      {
        undoAction,
        activeStepId: activeStep.id,
        activeChapterId: activeChapter.id,
      },
      ...this.state.history,
    ]);
  }

  updateHistory(history: EditorRendererState['history']) {
    this.setState({ history });
  }

  addLessonUpdate(
    action: LessonUpdatableAction,
    undoAction?: LessonUpdatableAction,
  ) {
    const { addLessonUpdate, lesson } = this.props;

    const updateStatusAction = updateLessonStatus(
      lesson,
      LessonDetailsStatus.DRAFT,
    );
    addLessonUpdate(updateStatusAction);

    undoAction && this.recordHistoryChange(undoAction);
    addLessonUpdate(action);
  }

  undoUpdate = () => {
    const { history } = this.state;
    const [prev, ...newHistory] = history;

    if (!prev) {
      return;
    }

    this.updateHistory(newHistory); // Update history stash

    this.setActiveChapterHandler(
      { id: prev.activeChapterId } as Chapter,
      prev.activeStepId,
    );
    this.addLessonUpdate(prev.undoAction);
  };

  setActiveStepHandler = (step: Step) => {
    const { activeChapter } = this.props;
    this.setActiveChapterHandler(activeChapter, step.id);
  };

  setActiveChapterHandler = (chapter: Chapter, activeStepId?: Step['id']) => {
    const { history } = this.props;
    history.replace({
      ...services.history.location,
      search: `?activeChapter=${chapter.id}${
        activeStepId ? `&activeStep=${activeStepId}` : ''
      }`,
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

    const action = updateLessonStep(lesson, activeChapter, step);
    const undoAction = updateLessonChapter(lesson, activeChapter);

    this.addLessonUpdate(action, undoAction);
  };

  updateStepRotation = (orientation?: PieceColor) => {
    const { activeStep } = this.props;
    this.updateStep(updateStepState(activeStep, { orientation }));
  };

  deleteStep = (step: Step, adjacent?: boolean) => {
    // It's very helpful behavior that only selected step can be deleted
    // It makes undo action much simpler regarding setting new active step
    const { activeChapter, history } = this.props;
    const parent = getParentStep(activeChapter, step);
    const newActiveStep = getPreviousStep(activeChapter, step);
    if (!newActiveStep) {
      // Don't allow deleting first step (for now)
      return;
    }
    if (isStep(parent)) {
      const updatedParent = removeStep(
        parent,
        step,
        adjacent === undefined ? step.stepType !== 'variation' : adjacent,
      );
      this.updateStep(updatedParent as Step);
    } else {
      const updatedParent = removeStep(parent, step, adjacent);
      this.updateChapter(updatedParent as Chapter);
    }
    history.replace({
      pathname: history.location.pathname,
      search: `?activeChapter=${activeChapter.id}&activeStep=${newActiveStep.id}`,
    });
  };

  updateChapter = (chapter: Chapter) => {
    const { lesson } = this.props;
    const action = updateLessonChapter(lesson, chapter);
    this.addLessonUpdate(action);
  };

  addNewChapter = () => {
    const { lesson } = this.props;
    const newChapter = createChapter(`Chapter ${lesson.state.chapters.length}`);
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
    const undoAction = updateLessonPath(
      lesson,
      ['state', 'chapters'],
      lesson.state.chapters,
    );
    this.addLessonUpdate(action, undoAction);
    history.replace(location.pathname);
  };

  resolveEditorContext = (): EditorContext => ({
    lesson: this.props.lesson,
    chapter: this.props.activeChapter,
    step: this.props.activeStep,

    updateChapter: this.updateChapter,
    removeChapter: this.removeChapter,
    setActiveChapter: this.setActiveChapterHandler,

    updateStep: this.updateStep,
    removeStep: this.deleteStep,
    setActiveStep: this.setActiveStepHandler,

    //updateVersions: this.updateVersions,
  });

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

  getIsDraft = () => {
    const { lesson } = this.props;
    const lastPublished = last(lesson.versions);

    if (!lastPublished) {
      return true;
    }

    console.log('lesson.state', lesson.state);
    console.log('lastPublished', lastPublished);
    const diff = getDiff(lesson.state, lastPublished, {});
    console.log('diff', diff);
    console.log('!isEmpty(diff)', !isEmpty(diff));
    return !isEmpty(diff);
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
    const { activeStep } = this.props;
    const lessonStatusText = this.renderLessonStatus();
    return (
      <Chessboard
        orientation={activeStep.state.orientation}
        onOrientationChange={this.updateStepRotation}
        {...props}
        header={
          <>
            {props.header || lessonStatusText}
            <Absolute right={20} top={20} onClick={this.undoUpdate}>
              Undo
            </Absolute>
          </>
        }
      />
    );
  };

  renderToolbox: EditorSidebarProps['renderToolbox'] = props => {
    const { activeChapter } = this.props;
    return (
      <StepToolbox
        actionsClassName="mr-n5"
        setActiveStep={this.setActiveStepHandler}
        updateStep={this.updateStep}
        removeStep={this.deleteStep}
        stepRoot={activeChapter}
        updateChapter={this.updateChapter}
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
              updateChapter={this.updateChapter}
              updateStep={this.updateStep}
              removeStep={this.deleteStep}
            />
          </Col>
          <Col md={6} lg={4} className="mh-100">
            <Sidebar>
              <Container>
                <Row>
                  <Col>
                    <Button
                      size="extra-small"
                      className="mr-3"
                      variant={this.getIsDraft() ? 'regular' : 'ghost'}
                      //onClick={() => this.updateVersions(lesson.state)}
                      disabled={!this.getIsDraft()}
                    >
                      Publish
                    </Button>
                    <Button
                      size="extra-small"
                      className="mr-3"
                      variant="regular"
                      onClick={() =>
                        promptModal(close => <TrainingModal close={close} />)
                      }
                    >
                      Assign lesson
                    </Button>
                    <Button
                      size="extra-small"
                      className="mr-3"
                      variant="regular"
                      onClick={() =>
                        promptModal(close => (
                          <CollaboratorModal close={close} lesson={lesson} />
                        ))
                      }
                    >
                      Collaborators
                    </Button>
                    <Button
                      size="extra-small"
                      variant="regular"
                      className="mr-3"
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
                    <Button
                      size="extra-small"
                      variant="regular"
                      onClick={() =>
                        downloadAs(
                          new Blob([JSON.stringify(lesson)], {
                            type: 'text/plain;charset=utf-8',
                          }),
                          lesson.state.title + '.json',
                        )
                      }
                    >
                      Download
                    </Button>
                  </Col>
                </Row>
                <Row className="mt-3 mb-3">
                  <Col className="col-auto">
                    <DifficultyDropdown
                      size="small"
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
                      initialHtml={lesson.state.title}
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
              <Col>
                <Stepper
                  activeStep={activeStep}
                  setActiveStep={this.setActiveStepHandler}
                  stepRoot={activeChapter}
                  updateChapter={this.updateChapter}
                  updateStep={this.updateStep}
                  removeStep={this.deleteStep}
                  root
                  renderToolbox={this.renderToolbox}
                />
              </Col>
              <RootStepButton
                updateChapter={this.updateChapter}
                chapter={activeChapter}
                className="mt-4"
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
  ]) as Steps;

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
