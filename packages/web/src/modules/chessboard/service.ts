import { Move, Shape } from '@types';

export const createMoveShape = (
  move: Move,
  opponent = false,
  lineWidth = 20,
): Shape => ({
  orig: move[0],
  dest: move[1],
  brush: opponent ? 'yellow' : 'green',
  modifiers: { lineWidth },
});
