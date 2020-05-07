import { FEN, Move } from '../app/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Chess = require('chess.js');

export const createFen = (position: FEN, moves: Move[]) => {
  const chess = new Chess(position + ' w - - 0 1');
  moves.forEach(([from, to]) => {
    const piece = chess.get(from);
    chess.remove(from);
    if (!chess.put(piece, to)) {
      throw Error(`Can't move ${piece} to square ${to}.`);
    }
  });
  return chess.fen();
};

export default Chess;
