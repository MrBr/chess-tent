import type { ChessInstance as ChessInstanceBase } from '@types/chess.js';

declare module '@types/chess.js' {
  export interface ChessInstance extends ChessInstanceBase {
    moves(options: {
      legal?: boolean;
      verbose?: boolean;
      square?: string;
      piece?: PieceType;
    }): Move[];
  }
}
