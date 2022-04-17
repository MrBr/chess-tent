import { FEN, Orientation, PieceColor, Services, Steps } from '@types';
import { services } from '@application';
import { addStepToLeft, updateStepState } from '@chess-tent/models';
import { createStepModuleStep } from './model';

const { getComment } = services;

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

export const createStepsFromNotableMoves: Services['createStepsFromNotableMoves'] =
  (moves, options) => {
    const comments = options?.comments || [];
    const orientation = options?.orientation;

    return moves.map(move =>
      createStepModuleStep('move', {
        description: getComment(comments, move.position),
        move,
        orientation,
      }),
    );
  };
