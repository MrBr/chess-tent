import {
  FEN,
  Key,
  Move,
  MoveShort,
  PieceRole,
  PieceRolePromotable,
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

export const switchTurnColor: Services['switchTurnColor'] = position => {
  const fenChunks = position.split(' ');
  fenChunks[1] = fenChunks[1] === 'w' ? 'b' : 'w';
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

export const extendRole: Services['extendRole'] = (role: PieceRoleShort) =>
  Object.entries<PieceRoleShort>(shortRoleMap).find(
    ([, shortRole]) => shortRole === role,
  )?.[0] as PieceRole;

export const shortenRole: Services['shortenRole'] = (role: PieceRole) =>
  shortRoleMap[role];

export const createPiece: Services['createPiece'] = (
  role,
  color,
  promoted,
) => ({ role, color, promoted });

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

export const isLegalMove: Services['isLegalMove'] = (
  position,
  move,
  promoted?,
  bothColors?,
) => {
  const shortMove = createMoveShortObject(move, promoted);
  const game = new Chess(position);
  if (!!game.move(shortMove)) {
    return true;
  }
  if (!bothColors) {
    return false;
  }
  const reversedColorGame = new Chess(switchTurnColor(position));
  return !!reversedColorGame.move(shortMove);
};

export const createNotableMovesFromGame: Services['createNotableMovesFromGame'] =
  game => {
    const history = game.history({ verbose: true });
    const headers = game.header();
    const gameReplay = new Chess(headers.FEN);

    const moves = history.map((chessMove, moveIndex) => {
      const { from, to, promotion } = chessMove;
      if (!gameReplay.move(chessMove)) {
        throw new Error('Invalid move');
      }

      const position = gameReplay.fen();
      const promoted = promotion
        ? transformPieceTypeToRole(promotion)
        : undefined;
      const captured = !!chessMove.captured;
      const color = transformColorKey(chessMove.color);
      const role = transformPieceTypeToRole(chessMove.piece);
      const piece = createPiece(role, color, !!promotion);
      const move: Move = [from, to];
      const index = Math.floor(moveIndex / 2) + 1;

      return createNotableMove(
        position,
        move,
        index,
        piece,
        captured,
        promoted,
      );
    });

    return moves;
  };

export const getComment: Services['getComment'] = (comments, fen) =>
  comments
    .find(comment => comment.fen === fen)
    ?.comment.replace(/ *\[[^\]]*]/g, '')
    .trim() || undefined;

export const uciToSan = (engineMove: string): MoveShort => {
  const from = (engineMove[0] + engineMove[1]) as Key;
  const to = (engineMove[2] + engineMove[3]) as Key;
  const promoted = extendRole(
    engineMove[4] as PieceRoleShort,
  ) as PieceRolePromotable;
  return createMoveShortObject([from, to], promoted);
};

export const getNextMoveIndex: Services['getNextMoveIndex'] = prevMove => {
  if (!prevMove) {
    return 1;
  }
  return prevMove.piece.color === 'black' ? prevMove.index + 1 : prevMove.index;
};

export const getFenPosition: Services['getFenPosition'] = fen =>
  fen.split(' ')[0];

export const getFenEnPassant: Services['getFenEnPassant'] = fen =>
  fen.split(' ')[3];
