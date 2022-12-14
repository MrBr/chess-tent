import {
  Color as CG_COLOR,
  FEN as CG_FEN,
  Piece as CG_PIECE,
  Role as CG_ROLE,
  MoveMetadata as CG_MOVEMETADATA,
} from '@chess-tent/chessground/dist/types';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  PieceType,
  ShortMove,
  Move as ChessJSMove,
  ChessInstance as ChessInstanceType,
} from 'chess.js';

export type ChessInstance = ChessInstanceType;
export type FEN = CG_FEN;
export type Piece = CG_PIECE;
// prettier-ignore
export type Key =
/* eslint-disable */
    'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1' |
    'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' |
    'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' |
    'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' |
    'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' |
    'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' |
    'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' |
    'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8';
/* eslint-enable */
export type ExtendedKey = Key | 'a0';
export type Move = [Key, Key];
export type NotableMove = {
  move: Move;
  promoted?: PieceRole;
  captured?: boolean;
  piece: Piece;
  index: number;
  position: FEN;
  checkmate?: boolean;
  stalemate?: boolean;
  // File and Rank indicate ambiguous move and have to be used for correct notation
  file?: boolean;
  rank?: boolean;
};
export type UciMove = string;
export type MoveShort = ShortMove;
export type ChessMove = ChessJSMove;
export type MoveMetadata = CG_MOVEMETADATA;
export type PieceColor = CG_COLOR;
export type MovableColor = PieceColor | 'both';
export type Orientation = CG_COLOR;
export type PieceColorShort = 'w' | 'b';
export type PieceRole = CG_ROLE;
export type PieceRolePromotable = 'knight' | 'rook' | 'bishop' | 'queen';
export type PieceRoleShort = PieceType;
export type PieceRoleShortPromotable = 'n' | 'r' | 'b' | 'q';
export type Shape = DrawShape;
export type Promotion = {
  from: Key;
  to: Key;
  piece: Piece;
  captured?: boolean;
};
