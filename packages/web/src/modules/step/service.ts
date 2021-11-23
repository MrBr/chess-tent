import { FEN, NotableMove, Orientation, PieceColor, Steps } from '@types';
import { addStepToLeft, updateStepState } from '@chess-tent/models';
import { createStepModuleStep } from './model';

export const getStepPosition = (step: Steps): FEN => {
  if (step.stepType === 'variation') {
    return step.state.move?.position || (step.state.position as FEN);
  }
  if (step.stepType === 'move') {
    return step.state.move.position;
  }
  if (step.stepType === 'exercise') {
    return step.state.task.position;
  }
  return step.state.position;
};

export const getStepBoardOrientation = (step: Steps): PieceColor => {
  return step.state.orientation || 'white';
};

export const updateStepRotation = (
  step: Steps,
  orientation?: Orientation,
): Steps => {
  return updateStepState(step, { orientation });
};

export const addStepNextToTheComments = <T extends Steps>(
  parentStep: T,
  step: Steps,
): T => {
  const commentsCount = parentStep.state.steps.filter(
    ({ stepType }) => stepType === 'description',
  ).length;
  return addStepToLeft(parentStep, step, commentsCount) as T;
};

export const createStepsFromNotableMoves = (moves: NotableMove[]) => {
  return moves.map(move =>
    createStepModuleStep('move', {
      move,
    }),
  );
};
