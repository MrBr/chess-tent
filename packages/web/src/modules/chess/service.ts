import {
  FEN,
  Move,
  PieceRole,
  PieceRoleShort,
  PieceRoleShortPromotable,
  Services,
} from '@types';
import { forEachRight } from 'lodash';
import { transformColorKey, transformPieceTypeToRole } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const Chess = require('chess.js');

export const createFenForward = (position: FEN, moves: Move[]) => {
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

export const createFenBackward = (position: FEN, moves: Move[]) => {
  const chess = new Chess(position);
  forEachRight(moves, ([to, from]) => {
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

export const getTurnColor: Services['getTurnColor'] = position => {
  return position.split(' ')[1] === 'w' ? 'white' : 'black';
};

export const setTurnColor: Services['setTurnColor'] = (position, color) => {
  const fenChunks = position.split(' ');
  fenChunks[1] = color === 'white' ? 'w' : 'b';
  return fenChunks.join(' ');
};

const shortRoleMap: Record<PieceRole, PieceRoleShort> = {
  knight: 'n',
  king: 'k',
  rook: 'r',
  queen: 'q',
  pawn: 'p',
  bishop: 'b',
};
export const shortenRole: Services['shortenRole'] = (role: PieceRole) =>
  shortRoleMap[role];

export const createMoveShortObject: Services['createMoveShortObject'] = (
  move,
  promoted,
) => ({
  from: move[0],
  to: move[1],
  promotion: promoted
    ? (shortenRole(promoted) as PieceRoleShortPromotable)
    : undefined,
});

export const createNotableMove: Services['createNotableMove'] = (
  position,
  move,
  index,
  piece,
  captured = false,
  promoted = undefined,
) => ({ position, move, index, piece, promoted, captured });
