import { FEN, PieceColor, Steps } from '@types';
import { addStepToLeft } from '@chess-tent/models';

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

export const addStepNextToTheComments = <T extends Steps>(
  parentStep: T,
  step: Steps,
): T => {
  const commentsCount = parentStep.state.steps.filter(
    ({ stepType }) => stepType === 'description',
  ).length;
  return addStepToLeft(parentStep, step, commentsCount) as T;
};
