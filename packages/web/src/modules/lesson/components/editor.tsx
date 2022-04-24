import React, { ComponentProps, useCallback, useEffect, useState } from 'react';
import {
  Chapter,
  getPreviousStep,
  removeStep,
  Step,
  LessonStateStatus,
  updateSubjectState,
  updateLessonChapter,
  updateLessonStep,
  addChapterToLesson,
  Lesson,
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
  Steps,
  History,
  Orientation,
} from '@types';
import { debounce } from 'lodash';
import { components, hooks, services, state, ui } from '@application';
import Sidebar from './editor-sidebar';
import ChaptersDropdown from './chapters-dropdown';
import RootStepButton from './editor-sidebar-root-step-button';
import { useLessonParams } from '../hooks/utility';

const { Container, Row, Col, Icon } = ui;
const { createChapter, updateStepRotation, logException } = services;
const {
  Stepper,
  StepRenderer,
  Chessboard,
  StepToolbox,
  ChessboardContextProvider,
} = components;
const {
  actions: { serviceAction },
} = state;
const { useDispatchBatched, useApi, useLocation, useHistory, useDiffUpdates } =
  hooks;

type EditorRendererProps = ComponentProps<Components['Editor']> & {
  activeChapter: Chapter;
  activeStep: Steps;
  dispatch: (action: Actions) => void;
  history: History;
  location: ReturnType<typeof useLocation>;
  lessonStatus: LessonStatus;
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

  static getDerivedStateFromError() {
    // TODO - handle error on UI?
    // So that React doesn't complain
    return {};
  }

  componentDidCatch(error: Error) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    logException(error);
    this.setActiveStepHandler();
  }

  closeEditor = () => {
    const history = this.props.history;
    history.goBack();
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

    if (lesson.state.status !== LessonStateStatus.DRAFT) {
      this.updateLessonStatusToDraft();
    }

    undoAction && this.recordHistoryChange(undoAction);
    addLessonUpdate(action);
  }

  updateLessonStatusToDraft = () => {
    const { addLessonUpdate, lesson } = this.props;
    const action = serviceAction(updateSubjectState)(lesson, {
      status: LessonStateStatus.DRAFT,
    });
    addLessonUpdate(action);
  };

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

  setActiveStepHandler = (step?: Step) => {
    const { activeChapter } = this.props;
    this.setActiveChapterHandler(activeChapter, step?.id);
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

  updateLessonStateDebounced = debounce((state: Partial<Lesson['state']>) => {
    const { lesson } = this.props;
    const action = serviceAction(updateSubjectState)(lesson, state);
    this.addLessonUpdate(action);
  }, 500);

  updateStep = (step: Step) => {
    const { lesson, activeChapter } = this.props;

    const action = serviceAction(updateLessonStep)(lesson, activeChapter, step);
    const undoAction = serviceAction(updateLessonChapter)(
      lesson,
      activeChapter,
    );

    // Only tracking history for the current chapter
    this.addLessonUpdate(action, undoAction);
  };

  updateStepRotation = (orientation?: Orientation) => {
    const { activeStep } = this.props;
    this.updateStep(updateStepRotation(activeStep, orientation));
  };

  deleteStep = (step: Step, adjacent?: boolean) => {
    // It's very helpful behavior that only selected step can be deleted
    // It makes undo action much simpler regarding setting new active step
    const { activeChapter, history } = this.props;
    const newActiveStep = getPreviousStep(activeChapter, step);
    if (!newActiveStep) {
      // Don't allow deleting first step (for now)
      return;
    }

    const updatedChapter = removeStep(
      activeChapter,
      step,
      adjacent === undefined ? step.stepType !== 'variation' : adjacent,
    );
    this.updateChapter(updatedChapter);

    history.replace({
      pathname: history.location.pathname,
      search: `?activeChapter=${activeChapter.id}&activeStep=${newActiveStep.id}`,
    });
  };

  updateChapter = (chapter: Chapter) => {
    const { lesson } = this.props;
    const action = serviceAction(updateLessonChapter)(lesson, chapter);
    this.addLessonUpdate(action);
  };

  addNewChapter = () => {
    const { lesson } = this.props;
    const newChapter = createChapter(`Chapter ${lesson.state.chapters.length}`);
    const action = serviceAction(addChapterToLesson)(lesson, newChapter);
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

    const action = serviceAction(updateSubjectState)(lesson, {
      chapters: newChapters,
    });
    const undoAction = serviceAction(updateSubjectState)(lesson, {
      chapters: lesson.state.chapters,
    });

    this.addLessonUpdate(action, undoAction);
    history.replace(location.pathname);
  };

  // TODO - instead of passing methods through the props use context
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
    const { activeStep, lesson } = this.props;
    const lessonStatusText = this.renderLessonStatus();
    return (
      <Chessboard
        key={lesson.id}
        orientation={activeStep.state.orientation}
        onOrientationChange={this.updateStepRotation}
        {...props}
        header={
          <>
            <Row>
              <Col> {props.header || lessonStatusText}</Col>
              <Col>
                <Icon type="back" onClick={this.undoUpdate} />
                <Icon type="forward" onClick={this.undoUpdate} />
              </Col>
              <Col>
                <Icon type="settings" />
              </Col>
            </Row>
          </>
        }
      />
    );
  };

  renderToolbox: EditorSidebarProps['renderToolbox'] = props => {
    const { activeChapter } = this.props;
    return (
      <StepToolbox
        actionsClassName="me-5"
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
    const { activeStep, lesson, activeChapter } = this.props;
    const lessonStatusText = this.renderLessonStatus();

    return (
      <Container fluid className="px-0 h-100">
        <Row className="g-0 h-100">
          <Col className="pt-5">
            <ChessboardContextProvider>
              <StepRenderer
                key={lesson.id}
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
            </ChessboardContextProvider>
          </Col>
          <Col md={6} lg={4} className="mh-100">
            <Sidebar>
              <Container>
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
                setActiveStep={this.setActiveStepHandler}
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
  const location = useLocation();
  const history = useHistory();
  const { activeChapter, activeStep } = useLessonParams(lesson);
  const {
    fetch: lessonUpdate,
    error: lessonUpdateError,
    response: lessonUpdateResponse,
    reset: lessonUpdateReset,
  } = useApi(save);
  const [lessonStatus, setLessonStatus] = useState<LessonStatus>(
    LessonStatus.INITIAL,
  );

  useDiffUpdates(lesson, (updates: LessonUpdates) => {
    lessonUpdate(lesson.id, updates);
  });

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
      dispatch(action);
    },
    [dispatch],
  );

  return (
    <EditorRenderer
      lesson={lesson}
      lessonStatus={lessonStatus}
      activeChapter={activeChapter}
      activeStep={activeStep}
      dispatch={dispatch}
      location={location}
      history={history}
      save={save}
      addLessonUpdate={handleLessonUpdate}
    />
  );
};

export default Editor;
