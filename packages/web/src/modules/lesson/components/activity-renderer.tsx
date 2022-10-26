import React from 'react';
import {
  ActivityRendererModuleBoard,
  ActivityRendererModuleCard,
  ActivityRendererProps,
  ActivityRendererState,
  ChessboardProps,
  Steps,
} from '@types';
import { components, services, ui, utils } from '@application';
import {
  getNextStep,
  getPreviousStep,
  updateActivityStepState,
  isEmptyAnalysis,
  getFirstStep,
  getLastStep,
} from '@chess-tent/models';
import {
  importLessonActivityChapters,
  updateActivityActiveStep,
} from '../service';
import { ActivityRendererStepBoard } from './activity-renderer-step';
import { ActivityRendererAnalysisBoard } from './activity-renderer-analysis-board';

const { LessonPlayground, ChessboardContextProvider, Chessboard } = components;
const { Container, Alert } = ui;
const { logException, parsePgn } = services;
const { createKeyboardNavigationHandler } = utils;

function isStepCard<T extends Steps | undefined>(
  rendererProps: ActivityRendererModuleCard<any>[],
  step: T,
): rendererProps is ActivityRendererModuleCard<T>[] {
  return true;
}

export class ActivityRenderer<
  T extends Steps | undefined,
> extends React.Component<ActivityRendererProps<T>, ActivityRendererState> {
  state: ActivityRendererState = {};

  componentDidMount() {
    document.addEventListener('keyup', this.handleKeypress);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeypress);
  }

  prevKeypress = () => {};

  upKeypress = () => {};

  downKeypress = () => {};

  importChaptersFromPgn = (pgn: string) => {
    const { updateActivity, activity } = this.props;
    const variations = parsePgn(pgn, { orientation: 'white' });

    const chapters = variations.map(({ tags, variation }, index) =>
      services.createChapter(tags?.Event || `Chapter ${index}`, [variation]),
    );

    updateActivity(importLessonActivityChapters)(activity, chapters);
  };

  setStepActivityState = (state: {}) => {
    const { activity, updateActivity, boardState } = this.props;

    updateActivity(updateActivityStepState)(activity, boardState, state);
  };

  static getDerivedStateFromError(error: Error) {
    return { error: true };
  }

  componentDidCatch(error: Error) {
    // You can also log the error to an error reporting service
    logException(error);
  }

  completeStep = () => {
    const { activity, updateActivity, boardState } = this.props;
    updateActivity(updateActivityStepState)(activity, boardState, {
      completed: true,
    });
  };

  nextActivityVariation = () => {
    const {
      updateActivity,
      chapter,
      step,
      activity,
      boardState,
      activityStepState,
    } = this.props;
    if (!chapter || !step) {
      return;
    }
    // Called from analysis when last move hit
    if (!boardState.analysing && !isEmptyAnalysis(activityStepState.analysis)) {
      const analysisStepId = getFirstStep(activityStepState.analysis)?.id;
      updateActivity(updateActivityActiveStep)(
        activity,
        boardState,
        step,
        analysisStepId,
      );
      return;
    }
    this.nextActivityStep();
  };

  prevActivityVariation = () => {
    const { updateActivity, chapter, step, activity, boardState } = this.props;
    if (!chapter || !step) {
      return;
    }
    let prevStep = getPreviousStep(chapter, step) as Steps;
    const prevStepAnalysis = boardState[prevStep?.id]?.analysis;
    if (prevStepAnalysis && !isEmptyAnalysis(prevStepAnalysis)) {
      const lastAnalysisStep = getLastStep(prevStepAnalysis, true);
      updateActivity(updateActivityActiveStep)(
        activity,
        boardState,
        prevStep,
        lastAnalysisStep?.id,
      );
      return;
    }
    this.prevActivityStep();
  };

  nextActivityStep = () => {
    const { updateActivity, chapter, step, activity, boardState } = this.props;
    if (!chapter || !step) {
      return;
    }
    const nextStep = getNextStep(chapter, step) as Steps;
    nextStep &&
      updateActivity(updateActivityActiveStep)(activity, boardState, nextStep);
  };

  prevActivityStep = () => {
    const { updateActivity, chapter, step, activity, boardState } = this.props;
    if (!chapter || !step) {
      return;
    }
    // Called from analysis when last move hit
    if (boardState.analysing) {
      updateActivity(updateActivityActiveStep)(activity, boardState, step);
      return;
    }
    const prevStep = getPreviousStep(chapter, step) as Steps;
    prevStep &&
      updateActivity(updateActivityActiveStep)(activity, boardState, prevStep);
  };

  handleKeypress = (e: KeyboardEvent) =>
    !this.props.boardState.analysing &&
    createKeyboardNavigationHandler(
      this.prevActivityStep,
      this.nextActivityStep,
      this.nextActivityVariation,
      this.prevActivityVariation,
    )(e);

  renderChessboard = (props: ChessboardProps) => {
    return (
      <Chessboard
        {...props}
        header={props.header || <Container />}
        onPGN={(pgn, asChapters) => {
          asChapters
            ? this.importChaptersFromPgn(pgn)
            : props.onPGN && props.onPGN(pgn, asChapters);
        }}
      />
    );
  };

  renderCardModules(modules: ActivityRendererModuleCard<T>[]) {
    const { activityStepState, step } = this.props;

    if (isStepCard(modules, step)) {
      return modules.map((Card, index) => (
        <Card
          key={index}
          {...this.props}
          setStepActivityState={this.setStepActivityState}
          stepActivityState={activityStepState}
          nextStep={this.nextActivityStep}
          prevStep={this.prevActivityStep}
          completeStep={this.completeStep}
        />
      ));
    }
  }

  renderBoard() {
    const { activityStepState, step, chapter, boardState } = this.props;

    const Board: ActivityRendererModuleBoard<T> = boardState.analysing
      ? ActivityRendererAnalysisBoard
      : ActivityRendererStepBoard;

    if (!Board) {
      return 'Unknown mode';
    }

    return (
      <Board
        {...this.props}
        step={step}
        chapter={chapter}
        setStepActivityState={this.setStepActivityState}
        stepActivityState={activityStepState}
        nextStep={this.nextActivityStep}
        prevStep={this.prevActivityStep}
        completeStep={this.completeStep}
        Chessboard={this.renderChessboard}
      />
    );
  }

  render() {
    const { cards, actions, navigation, sidebar } = this.props;
    const { error } = this.state;
    if (error) {
      return (
        <Alert variant="danger">
          Something went wrong. Please let us know about the error.
        </Alert>
      );
    }
    return (
      <ChessboardContextProvider>
        <LessonPlayground>
          <LessonPlayground.Board>{this.renderBoard()}</LessonPlayground.Board>
          <LessonPlayground.Sidebar>
            {this.renderCardModules(sidebar)}
            {this.renderCardModules(navigation)}
          </LessonPlayground.Sidebar>
        </LessonPlayground>
      </ChessboardContextProvider>
    );
  }
}

export default ActivityRenderer;
