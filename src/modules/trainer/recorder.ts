import { DrawShape } from 'chessground/draw';
import { ActionPayload, Actions } from '../app/types';

function isShapePayload(payload: ActionPayload): payload is DrawShape[] {
  return payload.length === 0 || typeof payload[0] !== 'string';
}

export const recordAction = (
  state: Actions,
  payload: ActionPayload,
): Actions => {
  if (isShapePayload(payload)) {
    // New shape
    return {
      ...state,
      shapes: payload,
    };
  }
  // New move
  return {
    ...state,
    moves: [...state.moves, payload],
  };
};
