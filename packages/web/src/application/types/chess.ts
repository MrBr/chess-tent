import {
  Color as CG_COLOR,
  FEN as CG_FEN,
  Key as CG_KEY,
  Piece as CG_PIECE,
  Role as CG_ROLE,
} from 'chessground/types';
import { DrawShape } from 'chessground/draw';

export type FEN = CG_FEN;
export type Piece = CG_PIECE;
export type Key = CG_KEY;
export type Move = [Key, Key];
export type PieceColor = CG_COLOR;
export type PieceRole = CG_ROLE;
export type Shape = DrawShape;
