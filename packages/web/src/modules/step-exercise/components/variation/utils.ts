import { Move, NotableMove } from '@types';

export const isCorrectActivityMove = (
  activityMove: Move,
  stepMove?: Move,
): boolean =>
  stepMove?.[0] === activityMove[0] && stepMove?.[1] === activityMove[1];

export const isVariationCompleted = (
  isCorrectActiveMove: boolean,
  stepToPlayMove: NotableMove | undefined,
) => isCorrectActiveMove && !stepToPlayMove;
