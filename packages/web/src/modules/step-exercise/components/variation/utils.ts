import {
  ExerciseVariationActivityState,
  ExerciseVariationStep,
  NotableMove,
} from '@types';
import { services } from '@application';

const { getFenPosition } = services;

export const isCorrectActivityMove = (
  activityMove: NotableMove,
  stepMove?: NotableMove,
): boolean =>
  !!stepMove &&
  getFenPosition(stepMove.position) === getFenPosition(activityMove.position);

export const isFENSetup = (
  activityIndex: number | undefined | null,
): activityIndex is undefined | null => activityIndex !== 0 && !activityIndex;

export const isVariationCompleted = (stepToPlayMove: NotableMove | undefined) =>
  !stepToPlayMove;

export const getActivityPosition = (
  step: ExerciseVariationStep,
  activityState: ExerciseVariationActivityState,
) => {
  const { activeMoveIndex, move, correct } = activityState;
  const { moves, position } = step.state.task;
  return (
    (!correct && move?.position) ||
    (activeMoveIndex && moves?.[activeMoveIndex - 1]?.position) ||
    move?.position ||
    position
  );
};
