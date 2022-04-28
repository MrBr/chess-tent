import React from 'react';
import {
  ActivityRendererModuleBoard,
  ActivityRendererModuleCard,
  ActivityRendererProps,
  ActivityRendererState,
  ActivityStepMode,
  AppStep,
  ChessboardProps,
  Steps,
} from '@types';
import { components, services } from '@application';
import {
  Chapter,
  getNextStep,
  getPreviousStep,
  markStepCompleted,
  Step,
  updateActivityStepState,
  TYPE_ACTIVITY,
} from '@chess-tent/models';
import Stepper from './activity-stepper';
import Header from './activity-header';
import { removeActivityChapter, updateActivityActiveChapter } from '../service';

const {
  LessonPlayground,
  ChessboardContextProvider,
  LessonPlaygroundCard,
  ConferencingProvider,
  Chessboard,
} = components;
const { updateLessonActivityActiveStep } = services;

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
  updateStepMode = (mode: ActivityStepMode) => {
    const { updateActivity, activity, boardState } = this.props;
    updateActivity(updateActivityStepState)(activity, boardState, {
      mode,
    });
  };

  setStepActivityState = (state: {}) => {
    const { activity, updateActivity, boardState } = this.props;

    updateActivity(updateActivityStepState)(activity, boardState, state);
  };

  completeStep = (step: Step) => {
    const { activity, updateActivity, boardState } = this.props;
    updateActivity(markStepCompleted)(activity, boardState, step);
  };

  chapterChangeHandler = (chapter: Chapter) => {
    const { updateActivity, activity, boardState } = this.props;
    updateActivity(updateActivityActiveChapter)(activity, boardState, chapter);
  };

  removeChapterHandler = (chapter: Chapter) => {
    const { updateActivity, activity, boardState } = this.props;
    updateActivity(removeActivityChapter)(activity, boardState, chapter);
  };

  updateActiveStep = (step: AppStep) => {
    const { updateActivity, activity, boardState } = this.props;
    updateActivity(updateLessonActivityActiveStep)(
      activity,
      boardState,
      step as Steps,
    );
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
    const { boards, activityStepState } = this.props;
    return (
      <Chessboard
        {...props}
        header={
          <Header
            boards={boards}
            activeMode={activityStepState.mode}
            onChange={this.updateStepMode}
          />
        }
      />
    );
  };

  renderCards() {
    const { activityStepState, cards, step } = this.props;

    if (isStepCard(cards, step)) {
      return cards.map((Card, index) => (
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
    const { activityStepState, boards, step } = this.props;

    if (isStepBoard(boards, step)) {
      const Board = boards.find(board => board.mode === activityStepState.mode);
      if (!Board) {
        return 'Unknown mode';
      }
      return (
        <Board
          {...this.props}
          step={step}
          chapter={step}
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
    const { chapter, activity, lesson, importChapters } = this.props;

    return (
      <ChessboardContextProvider>
        <LessonPlayground>
          <LessonPlayground.Board>{this.renderBoard()}</LessonPlayground.Board>
          <LessonPlayground.Sidebar>
            {this.renderCards()}
            <LessonPlaygroundCard>
              <ConferencingProvider room={`${TYPE_ACTIVITY}-${activity.id}`} />
            </LessonPlaygroundCard>
          </LessonPlayground.Sidebar>
          <LessonPlayground.Stepper>
            <Stepper
              next={this.nextActivityStep}
              prev={this.prevActivityStep}
              onStepClick={this.updateActiveStep}
              activeChapter={chapter}
              chapters={lesson.state.chapters}
              onChapterImport={importChapters}
              onChapterRemove={this.removeChapterHandler}
              onChapterChange={this.chapterChangeHandler}
            />
          </LessonPlayground.Stepper>
        </LessonPlayground>
      </ChessboardContextProvider>
    );
  }
}

export default ActivityRenderer;
