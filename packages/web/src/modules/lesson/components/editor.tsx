import React, { ComponentProps } from 'react';
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
  getNextStep,
  getRightStep,
  moveLessonChapter,
} from '@chess-tent/models';
import {
  Actions,
  ChessboardProps,
  Components,
  EditorContext,
  EditorSidebarProps,
  ApiStatus,
  LessonUpdatableAction,
  Steps,
  History,
  Orientation,
  UPDATE_ENTITY,
} from '@types';
import * as H from 'history';
import { components, hooks, services, state, ui, utils } from '@application';
import { css } from '@chess-tent/styled-props';
import ChaptersDropdown from './chapters-dropdown';
import RootStepButton from './editor-sidebar-root-step-button';
import { useLessonParams } from '../hooks/lesson';

const { Row, Col, Icon, Button, OverlayTrigger, Tooltip, ToggleButton, Text } =
  ui;
const { createChapter, updateStepRotation, logException } = services;
const {
  Stepper,
  StepRenderer,
  Chessboard,
  StepToolbox,
  ChessboardContextProvider,
  Evaluation,
  RedirectPrompt,
} = components;
const {
  actions: { serviceAction },
} = state;
const { useDispatchBatched, useLocation, useHistory } = hooks;
const { mobileCss, createKeyboardNavigationHandler } = utils;

const { className } = css`
  width: 100%;
  // class "editor" and styles overflow-hidden position-relative
  // Used in step-toolbox to prevent scrollbar flickering until toolbox fades
  height: 100%;
  position: relative;
  overflow: hidden;

  .editor-board {
    grid-area: board;
    border-right: 1px solid var(--grey-400-color);
    padding: 25px 80px 0 90px;
  }

  .editor-actions {
    grid-area: actions;
    padding: 24px 24px 0 24px;
    border-bottom: 1px solid var(--grey-400-color);
  }

  .editor-sidebar {
    grid-area: sidebar;
    position: relative;

    > div {
      // Needed to get properly scrollable sidebar
      padding: 12px 0 64px;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }

    > div > * {
      margin-bottom: 24px;
    }
  }

  .editor-navigation {
    grid-area: navigation;
    background: var(--light-color);
    padding: 24px;
    z-index: 10;
    border-top: 1px solid var(--grey-400-color);
  }

  display: grid;
  grid-template-rows: min-content 1fr min-content;
  grid-template-columns: 6fr 3.5fr;
  grid-template-areas:
    'board actions'
    'board sidebar'
    'board navigation';

  ${mobileCss`
    overflow: unset;

    .editor-board {
      padding: 0;
    }

    .editor-sidebar {
      padding-left: 12px;

      > div {
        position: relative;
      }
    }

    .editor-navigation {
      border-top: 1px solid var(--grey-400-color);
      position: sticky;
      width: 100%;
      left: 0;
      bottom: 0;
    }

    grid-template-rows: 75% min-content min-content auto;
    grid-template-columns: 1fr;
    grid-template-areas:
    'board'
    'actions'
    'sidebar'
    'navigation';
  `}
`;

type EditorRendererProps = ComponentProps<Components['Editor']> & {
  activeChapter: Chapter;
  activeStep: Steps;
  dispatch: (action: Actions) => void;
  history: History;
  location: ReturnType<typeof useLocation>;
  lessonStatus: ApiStatus;
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

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    document.addEventListener('keyup', this.handleKeypress);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    document.removeEventListener('keyup', this.handleKeypress);
  }

  handleSilentBeforeUnload = (location: H.Location) => {
    const { history, lessonStatus } = this.props;
    if (history.location.pathname === location.pathname) {
      return true;
    } else if (lessonStatus !== ApiStatus.DIRTY) {
      return true;
    }
    return 'Please wait until all changes are saved.';
  };

  handleBeforeUnload = (e: Event) => {
    const { lessonStatus } = this.props;
    if (lessonStatus === ApiStatus.DIRTY) {
      e.returnValue = false;
    }
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

  addLessonUpdate(action: LessonUpdatableAction) {
    const { addLessonUpdate, lesson } = this.props;

    if (lesson.state.status !== LessonStateStatus.DRAFT) {
      this.updateLessonStatusToDraft();
    }

    if (
      action.type === UPDATE_ENTITY &&
      action.meta.patch &&
      action.meta.patch.prev.length > 0
    ) {
      this.recordHistoryChange({
        type: UPDATE_ENTITY,
        meta: {
          ...action.meta,
          patch: {
            // TODO - Use for redo
            // prev: action.meta.patch.next,
            prev: [],
            next: action.meta.patch.prev,
          },
        },
        payload: { entities: {} },
      });
    }
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

  nextStepHandler = () => {
    const { activeChapter, activeStep } = this.props;
    const nextStep = getNextStep(activeChapter, activeStep);
    nextStep && this.setActiveStepHandler(nextStep);
  };

  prevStepHandler = () => {
    const { activeChapter, activeStep } = this.props;
    const prevStep = getPreviousStep(activeChapter, activeStep);
    prevStep && this.setActiveStepHandler(prevStep);
  };

  handleKeypress = createKeyboardNavigationHandler(
    this.prevStepHandler,
    this.nextStepHandler,
  );

  setActiveChapterHandler = (chapter: Chapter, activeStepId?: Step['id']) => {
    const { history } = this.props;
    history.replace({
      ...services.history.location,
      search: `?activeChapter=${chapter.id}${
        activeStepId ? `&activeStep=${activeStepId}` : ''
      }`,
    });
  };

  updateStep = (step: Step) => {
    const { lesson, activeChapter } = this.props;

    // TODO - in future accept step patch instead of step to have even smaller updates
    const action = serviceAction(updateLessonStep)(lesson, activeChapter, step);

    // Only tracking history for the current chapter
    this.addLessonUpdate(action);
  };

  updateStepRotation = (orientation?: Orientation) => {
    const { activeStep } = this.props;
    this.updateStep(updateStepRotation(activeStep, orientation));
  };

  deleteStep = (step: Step, adjacent?: boolean) => {
    // It's very helpful behavior that only selected step can be deleted
    // It makes undo action much simpler regarding setting new active step
    const { activeChapter, history } = this.props;
    const newActiveStep =
      getPreviousStep(activeChapter, step) || getRightStep(activeChapter, step);

    if (!newActiveStep) {
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

  moveChapter = (up?: boolean) => {
    const { lesson, activeChapter } = this.props;
    const action = serviceAction(moveLessonChapter)(lesson, activeChapter, up);
    this.addLessonUpdate(action);
    this.setActiveChapterHandler(activeChapter);
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

    this.addLessonUpdate(action);
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

  renderChessboard = (props: ChessboardProps) => {
    const { activeStep, lesson } = this.props;
    return (
      <Chessboard
        key={lesson.id}
        orientation={activeStep.state.orientation}
        onOrientationChange={this.updateStepRotation}
        {...props}
        header={
          <Row className="align-items-center">
            <Col xs={8}>
              {props.header || (
                <ToggleButton variant="tertiary" size="small" checked>
                  Step
                </ToggleButton>
              )}
            </Col>
            <Col>
              <OverlayTrigger overlay={<Tooltip>Undo</Tooltip>}>
                <Icon type="back" onClick={this.undoUpdate} />
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>Redo - not working</Tooltip>}>
                <Icon type="forward" />
              </OverlayTrigger>
            </Col>
            <Col className="col-auto">
              <Icon type="settings" />
            </Col>
          </Row>
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
    const { activeStep, lesson, activeChapter, lessonStatus } = this.props;

    return (
      <ChessboardContextProvider>
        <div className={`${className} editor`}>
          <div className="editor-board">
            {/*
               Maybe it can be optimised by making a function call like stepRenderer().
               React shouldn't unmount the same components lower in chain such as board in that case.
               Currently, different step types unmount the board.
              */}
            <StepRenderer
              key={lesson.id}
              step={activeStep}
              component="EditorBoard"
              activeStep={activeStep}
              setActiveStep={this.setActiveStepHandler}
              stepRoot={activeChapter}
              status={lessonStatus}
              Chessboard={this.renderChessboard}
              updateChapter={this.updateChapter}
              updateStep={this.updateStep}
              removeStep={this.deleteStep}
            />
          </div>
          <div className="editor-actions">
            <ChaptersDropdown
              editable
              activeChapter={activeChapter}
              chapters={lesson.state.chapters}
              onChange={this.setActiveChapterHandler}
              onEdit={this.updateChapterTitle}
              onNew={this.addNewChapter}
              onRemove={this.removeChapter}
              onMove={this.moveChapter}
            />
          </div>
          <div className="editor-sidebar">
            <div>
              <div className="ps-3">
                <Evaluation />
              </div>
              <div className="h-100 overflow-y-auto position-relative ps-4 pe-3">
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
                {activeChapter.state.steps.length === 1 &&
                  activeChapter.state.steps[0].state.steps.length === 0 && (
                    <>
                      <Text
                        fontSize="extra-small"
                        weight={500}
                        className="mt-5 mb-1"
                      >
                        TIP
                      </Text>
                      <Text fontSize="extra-small">
                        Start by making a move or setting the position.
                      </Text>
                    </>
                  )}
              </div>
            </div>
          </div>
          <div className="editor-navigation">
            <Row>
              <Col>
                <RootStepButton
                  updateChapter={this.updateChapter}
                  setActiveStep={this.setActiveStepHandler}
                  chapter={activeChapter}
                />
              </Col>
              <Col>
                <Button
                  variant="ghost"
                  stretch
                  size="small"
                  onClick={this.prevStepHandler}
                >
                  <Icon type="left" />
                </Button>
              </Col>
              <Col>
                <Button
                  variant="ghost"
                  stretch
                  size="small"
                  onClick={this.nextStepHandler}
                >
                  <Icon type="right" />
                </Button>
              </Col>
            </Row>
          </div>
          <RedirectPrompt message={this.handleSilentBeforeUnload} />
        </div>
      </ChessboardContextProvider>
    );
  }
}

const Editor: Components['Editor'] = ({ lesson, lessonStatus }) => {
  const dispatch = useDispatchBatched();
  const location = useLocation();
  const history = useHistory();
  const { activeChapter, activeStep } = useLessonParams(lesson);

  return (
    <EditorRenderer
      lesson={lesson}
      lessonStatus={lessonStatus}
      activeChapter={activeChapter}
      activeStep={activeStep}
      dispatch={dispatch}
      location={location}
      history={history}
      addLessonUpdate={dispatch}
    />
  );
};

export default Editor;
