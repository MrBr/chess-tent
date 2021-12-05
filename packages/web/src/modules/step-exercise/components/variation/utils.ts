import {
  ExerciseVariationActivityState,
  ExerciseVariationStep,
  Move,
  NotableMove,
} from '@types';

export const isCorrectActivityMove = (
  activityMove: Move,
  stepMove?: Move,
): boolean =>
  stepMove?.[0] === activityMove[0] && stepMove?.[1] === activityMove[1];

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
