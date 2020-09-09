import {
  Color as CG_COLOR,
  FEN as CG_FEN,
  Key as CG_KEY,
  Piece as CG_PIECE,
  Role as CG_ROLE,
  MoveMetadata as CG_MOVEMETADATA,
} from '@chess-tent/chessground/dist/types';
import { DrawShape } from '@chess-tent/chessground/dist/draw';

export type FEN = CG_FEN;
export type Piece = CG_PIECE;
export type Key = CG_KEY;
export type Move = [Key, Key];
export type NotableMove = {
  move?: Move;
  promoted?: boolean;
  captured?: boolean;
  movedPiece?: Piece;
  moveIndex?: number;
};
export type MoveMetadata = CG_MOVEMETADATA;
export type PieceColor = CG_COLOR;
export type PieceRole = CG_ROLE;
export type Shape = DrawShape;
