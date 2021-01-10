import { FEN, Steps } from '@types';
import { addStepToLeft } from '@chess-tent/models';

export const getStepPosition = (step: Steps): FEN => {
  if (step.stepType === 'variation') {
    return step.state.move?.position || (step.state.position as FEN);
  }
  if (step.stepType === 'move') {
    return step.state.move.position;
  }
  return step.state.position;
};

export const addStepNextToTheComments = (parentStep: Steps, step: Steps) => {
  const commentsCount = parentStep.state.steps.filter(
    ({ stepType }) => stepType === 'description',
  ).length;
  return addStepToLeft(parentStep, step, commentsCount) as Steps;
};
