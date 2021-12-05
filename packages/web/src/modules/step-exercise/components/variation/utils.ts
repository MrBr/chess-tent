import {
  ExerciseVariationActivityState,
  ExerciseVariationStep,
  NotableMove,
} from '@types';

export const isCorrectActivityMove = (
  activityMove: NotableMove,
  stepMove?: NotableMove,
): boolean => activityMove.position === stepMove?.position;

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
