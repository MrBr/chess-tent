import React from 'react';
import {
  ActivityRendererModuleBoard,
  ActivityRendererModuleCard,
  ActivityRendererProps,
  ActivityRendererState,
  ChessboardProps,
  Steps,
} from '@types';
import { components, services, ui } from '@application';
import {
  getNextStep,
  getPreviousStep,
  updateActivityStepState,
} from '@chess-tent/models';
import { importLessonActivityChapters } from '../service';

const { LessonPlayground, ChessboardContextProvider, Chessboard } = components;
const { Container, Alert } = ui;
const { updateLessonActivityActiveStep, logException, parsePgn } = services;

function isStepBoard<T extends Steps | undefined>(
  rendererProps: ActivityRendererModuleBoard<any>[],
  step: T,
): rendererProps is ActivityRendererModuleBoard<T>[] {
  return true;
}

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

  nextActivityStep = () => {
    const { updateActivity, chapter, step, activity, boardState } = this.props;
    if (!chapter || !step) {
      return;
    }
    const nextStep = getNextStep(chapter, step) as Steps;
    nextStep &&
      updateActivity(updateLessonActivityActiveStep)(
        activity,
        boardState,
        nextStep,
      );
  };

  prevActivityStep = () => {
    const { updateActivity, chapter, step, activity, boardState } = this.props;
    if (!chapter || !step) {
      return;
    }
    const prevStep = getPreviousStep(chapter, step) as Steps;
    prevStep &&
      updateActivity(updateLessonActivityActiveStep)(
        activity,
        boardState,
        prevStep,
      );
  };

  renderChessboard = (props: ChessboardProps) => {
    return (
      <Chessboard
        {...props}
        header={<Container />}
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
    const { activityStepState, boards, step, chapter } = this.props;

    if (isStepBoard(boards, step)) {
      const Board = boards.find(board => board.mode === activityStepState.mode);
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
          <LessonPlayground.Actions>
            {this.renderCardModules(actions)}
          </LessonPlayground.Actions>
          <LessonPlayground.Cardbar>
            {this.renderCardModules(cards)}
          </LessonPlayground.Cardbar>
          <LessonPlayground.Navigation>
            {this.renderCardModules(navigation)}
          </LessonPlayground.Navigation>
          <LessonPlayground.Sidebar>
            {this.renderCardModules(sidebar)}
          </LessonPlayground.Sidebar>
        </LessonPlayground>
      </ChessboardContextProvider>
    );
  }
}

export default ActivityRenderer;
