import { Move } from '@types';

export const isCorrectActivityMove = (activityMove: Move, stepMove?: Move) =>
  stepMove?.[0] === activityMove[0] && stepMove?.[1] === activityMove[1];
