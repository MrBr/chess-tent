import { FEN, Key, MovableColor, Piece } from '@types';
import { ChessInstance } from 'chess.js';
import { Config } from '@chess-tent/chessground/dist/config';
import { services } from '@application';
import isNil from 'lodash/isNil';
import { getTurnColor, switchTurnColor } from '../chess/service';

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
  // en passant
  fenComponents[3] = '-';

  return fenComponents.join(' ');
}

export function toDests(
  position: FEN,
  bothColors?: boolean,
): {
  [key: string]: Key[];
} {
  const chess = new Chess(position) as ChessInstance;
  const dests: { [key: string]: Key[] } = {};
  chess.SQUARES.forEach((s: string) => {
    const ms = chess.moves({ square: s, verbose: true });
    if (ms.length) dests[s] = ms.map(m => m.to);
  });

  const oppositeColorMoves = bothColors
    ? toDests(switchTurnColor(position))
    : {};

  return { ...dests, ...oppositeColorMoves };
}

export function updateMovable(
  config: Config,
  fen: FEN,
  movableColor?: MovableColor,
): Config {
  const turnColor = getTurnColor(fen);
  return {
    ...config,
    turnColor,
    movable: {
      ...config.movable,
      free: true,
      dests: toDests(fen, movableColor === 'both'),
      color: movableColor || turnColor,
    },
  };
}

export function unfreeze<T>(value: T): T {
  if (isNil(value)) {
    return value;
  }
  const newValue = (Array.isArray(value)
    ? value.map(unfreeze)
    : typeof value === 'object'
    ? Object.keys(value).reduce((result, key) => {
        // @ts-ignore
        result[key] = unfreeze(value[key]);
        return result;
      }, {})
    : value) as T;
  return newValue;
}
