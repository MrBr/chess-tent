import {
  FEN,
  Key,
  Move,
  MoveShort,
  NotableMove,
  Piece,
  PieceColor,
  PieceRole,
  PieceRolePromotable,
  PieceRoleShort,
  PieceRoleShortPromotable,
  Services,
} from '@types';
import { forEachRight } from 'lodash';
import { Chess } from 'chess.js';
import { transformColorKey, transformPieceTypeToRole } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-var-requires

const shortRoleMap: Record<PieceRole, PieceRoleShort> = {
  knight: 'n',
  king: 'k',
  rook: 'r',
  queen: 'q',
  pawn: 'p',
  bishop: 'b',
};

export const createFenForward = (position: FEN, moves: Move[]) => {
  const chess = new Chess(position);
  moves.forEach(([from, to]) => {
    const piece = chess.get(from);
    chess.remove(from);
    if (!piece || !chess.put(piece, to)) {
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
    if (!piece || !chess.put(piece, to)) {
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
) => {
  const notableMove: NotableMove = {
    position,
    move,
    index,
    piece,
    promoted,
    captured,
  };

  const game = new Chess(position);

  const checkmate = game.in_checkmate();
  if (checkmate) {
    notableMove.checkmate = checkmate;
  }

  const stalemate = game.in_stalemate();
  if (stalemate) {
    notableMove.stalemate = stalemate;
  }

  const ambiguities = getMoveAmbiguities(position, move, piece, captured);

  if (ambiguities.file) {
    notableMove.file = ambiguities.file;
  }

  if (ambiguities.rank) {
    notableMove.rank = ambiguities.rank;
  }

  return notableMove;
};

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

export const createNotableMoveFromChessMove: Services['createNotableMoveFromChessMove'] =
  (position, move, index) => {
    const role = transformPieceTypeToRole(move.piece);
    const color = transformColorKey(move.color);
    const promoted = move.promotion && transformPieceTypeToRole(move.promotion);
    const piece = createPiece(role, color, !!move.promotion);
    return createNotableMove(
      position,
      [move.from, move.to],
      index,
      piece,
      !!move.captured,
      promoted,
    );
  };

export const uciToSan = (engineMove: string): MoveShort => {
  const from = (engineMove[0] + engineMove[1]) as Key;
  const to = (engineMove[2] + engineMove[3]) as Key;
  const promoted = extendRole(
    engineMove[4] as PieceRoleShort,
  ) as PieceRolePromotable;
  return createMoveShortObject([from, to], promoted);
};

export const getNextMoveIndex: Services['getNextMoveIndex'] = (
  prevMove,
  newMoveColor,
  allowNull,
) => {
  if (!prevMove) {
    return 1;
  }
  return (allowNull && prevMove.piece.color === newMoveColor) ||
    prevMove.piece.color === 'black'
    ? prevMove.index + 1
    : prevMove.index;
};

export const getFenPosition: Services['getFenPosition'] = fen =>
  fen.split(' ')[0];

export const getFenEnPassant: Services['getFenEnPassant'] = fen =>
  fen.split(' ')[3];

export const extendRole: Services['extendRole'] = (role: PieceRoleShort) =>
  Object.entries<PieceRoleShort>(shortRoleMap).find(
    ([, shortRole]) => shortRole === role,
  )?.[0] as PieceRole;

export function getRank(square: Key) {
  return square.charAt(1);
}

export function getFile(square: Key) {
  return square.charAt(0);
}

export const shortenRole: Services['shortenRole'] = (role: PieceRole) =>
  shortRoleMap[role];

export const shortenColor: Services['shortenColor'] = (color: PieceColor) =>
  color === 'white' ? 'w' : 'b';

/*
 * The following code bellow is copied from chess.js library and modified.
 *
 * Copyright (c) 2022, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/
/**
 * Function returns ambiguous axis
 */
export function getMoveAmbiguities(
  newPosition: FEN,
  move: Move,
  piece: Piece,
  captured: boolean,
) {
  const game = new Chess(switchTurnColor(newPosition));
  // Undo move to check if the move is ambiguous
  game.remove(move[1]);
  const shortPiece = shortenRole(piece.role);
  const shortColor = shortenColor(piece.color);
  game.put(
    {
      type: shortPiece,
      color: shortColor,
    },
    move[0],
  );

  if (captured) {
    // HACK
    // If piece is captured place something on captured square.
    // 1. placing always pawn, piece can't be retrieved
    // 2. en passant should work but the pawn isn't actually on right square
    game.put(
      {
        type: 'p',
        color: shortColor === 'w' ? 'b' : 'w',
      },
      move[1],
    );
  }

  const moves = game.moves({
    legal: true,
    piece: shortPiece,
    verbose: true,
  });
  const from = move[0];
  const to = move[1];

  let same_rank = 0;
  let same_file = 0;

  for (let i = 0, len = moves.length; i < len; i++) {
    const ambig_from = moves[i].from;
    const ambig_to = moves[i].to;
    const ambig_piece = moves[i].piece;

    /* if a move of the same piece type ends on the same to square, we'll
     * need to add a disambiguator to the algebraic notation
     */
    if (shortPiece === ambig_piece && from !== ambig_from && to === ambig_to) {
      if (getFile(from) === getFile(ambig_from)) {
        same_file++;
      }

      if (getRank(from) === getRank(ambig_from) || same_file === 0) {
        same_rank++;
      }
    }
  }

  return { file: same_file > 0, rank: same_rank > 0 };
}
