import React from 'react';
import {
  ActivityRendererModuleBoard,
  ActivityRendererModuleCard,
  ActivityRendererProps,
  ActivityRendererState,
  AppStep,
  ChessboardProps,
  Steps,
} from '@types';
import { components, services, ui } from '@application';
import {
  applyUpdates,
  Chapter,
  getNextStep,
  getPreviousStep,
  moveLessonChapter,
  updateActivityStepState,
} from '@chess-tent/models';
import Stepper from './activity-stepper';
import { removeActivityChapter, updateActivityActiveChapter } from '../service';

const { LessonPlayground, ChessboardContextProvider, Chessboard } = components;
const { Container } = ui;
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
  setStepActivityState = (state: {}) => {
    const { activity, updateActivity, boardState } = this.props;

    updateActivity(updateActivityStepState)(activity, boardState, state);
  };

  completeStep = () => {
    const { activity, updateActivity, boardState } = this.props;
    updateActivity(updateActivityStepState)(activity, boardState, {
      completed: true,
    });
  };

  chapterChangeHandler = (chapter: Chapter) => {
    const { updateActivity, activity, boardState } = this.props;
    updateActivity(updateActivityActiveChapter)(activity, boardState, chapter);
  };

  chapterMoveHandler = (up?: boolean) => {
    const { updateActivity, activity, chapter } = this.props;
    updateActivity(
      applyUpdates(activity)(draft => {
        moveLessonChapter(draft.subject, chapter as Chapter, up);
      }),
    )();
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
    return <Chessboard {...props} header={<Container />} />;
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
    const {
      chapter,
      lesson,
      importChapters,
      boardState,
      cards,
      actions,
      navigation,
    } = this.props;

    return (
      <ChessboardContextProvider>
        <LessonPlayground>
          <LessonPlayground.Board>{this.renderBoard()}</LessonPlayground.Board>
          <LessonPlayground.Actions>
            {this.renderCardModules(actions)}
          </LessonPlayground.Actions>
          <LessonPlayground.Sidebar>
            {this.renderCardModules(cards)}
          </LessonPlayground.Sidebar>
          <LessonPlayground.Navigation>
            {this.renderCardModules(navigation)}
          </LessonPlayground.Navigation>
          <LessonPlayground.Stepper>
            <Stepper
              boardState={boardState}
              onStepClick={this.updateActiveStep}
              activeChapter={chapter}
              chapters={lesson.state.chapters}
              onChapterImport={importChapters}
              onChapterRemove={importChapters && this.removeChapterHandler}
              onChapterMove={importChapters && this.chapterMoveHandler}
              onChapterChange={importChapters && this.chapterChangeHandler}
            />
          </LessonPlayground.Stepper>
        </LessonPlayground>
      </ChessboardContextProvider>
    );
  }
}

export default ActivityRenderer;
