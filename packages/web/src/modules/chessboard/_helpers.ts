import { FEN, Key, Piece } from '@types';
import { ChessInstance } from 'chess.js';
import { Config } from '@chess-tent/chessground/dist/config';
import { services } from '@application';

const { Chess } = services;

export function replaceFENPosition(
  fen: FEN,
  newFenPosition: string,
  piece?: Piece,
): FEN {
  const fenComponents = fen.split(' ');
  fenComponents[0] = newFenPosition;
  fenComponents[1] = piece
    ? piece.color === 'white'
      ? 'b'
      : 'w'
    : fenComponents[1];
  return fenComponents.join(' ');
}

export function toDests(
  position: FEN,
): {
  [key: string]: Key[];
} {
  const chess = new Chess(position) as ChessInstance;
  const dests: { [key: string]: Key[] } = {};
  chess.SQUARES.forEach((s: string) => {
    const ms = chess.moves({ square: s, verbose: true });
    if (ms.length) dests[s] = ms.map(m => m.to);
  });
  return dests;
}

export function updateMovable(config: Config, fen: FEN): Config {
  const turnColor = fen.split(' ')[1] === 'w' ? 'white' : 'black';
  return {
    ...config,
    turnColor,
    movable: {
      ...config.movable,
      dests: toDests(fen),
      color: turnColor,
    },
  };
}

export function unfreeze<T>(value: T): T {
  const newValue = (Array.isArray(value)
    ? value.map(unfreeze)
    : typeof value === 'object'
    ? Object.keys(value).reduce((result, key) => {
        // @ts-ignore
        result[key] = unfreeze(value[key]);
        console.log('Prop is sealed', Object.isSealed(result));
        return result;
      }, {})
    : value) as T;
  console.log(
    'Prop',
    Object.isSealed(value),
    Object.isSealed(newValue),
    typeof value,
  );

  return newValue;
}
