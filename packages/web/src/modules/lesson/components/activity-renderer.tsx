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
    const { cards, actions, navigation, sidebar } = this.props;

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
