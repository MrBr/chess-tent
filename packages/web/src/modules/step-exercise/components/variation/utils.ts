import { Move, NotableMove } from '@types';

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
