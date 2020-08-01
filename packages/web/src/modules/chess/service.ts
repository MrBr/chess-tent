import { FEN, Move, Services } from '@types';
import { transformColorKey, transformPieceTypeToRole } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const Chess = require('chess.js');

export const createFen = (position: FEN, moves: Move[]) => {
  const chess = new Chess(position);
  moves.forEach(([from, to]) => {
    const piece = chess.get(from);
    chess.remove(from);
    if (!chess.put(piece, to)) {
      throw Error(`Can't move ${piece} to square ${to}.`);
    }
  });
  return chess.fen();
};

export const getPiece: Services['getPiece'] = (position, square) => {
  const chess = new Chess(position);
  const piece = chess.get(square);

  if (!piece) {
    return null;
  }

  return {
    role: transformPieceTypeToRole(piece.type),
    color: transformColorKey(piece.color),
  };
};
