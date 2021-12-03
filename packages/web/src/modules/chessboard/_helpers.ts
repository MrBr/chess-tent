import { FEN, Key, Piece } from '@types';
import { ChessInstance } from 'chess.js';
import { services } from '@application';
import isNil from 'lodash/isNil';
import _set from 'lodash/set';
import { ChessgroundMappedPropsType } from './types';

const { Chess, getTurnColor, switchTurnColor } = services;

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

export const ChessgroundMappedProps: ChessgroundMappedPropsType = {
  viewOnly: 'viewOnly',
  fen: (props, update) => {
    // Chessground needs legal moves list in "strict mode";
    // Legal moves are resolved bellow
    const dests = props.allowAllMoves
      ? null
      : toDests(props.fen, props.movableColor === 'both');
    const turnColor = getTurnColor(props.fen);

    _set(update, 'fen', props.fen);
    _set(update, 'movable.dests', dests);
    _set(update, 'turnColor', turnColor);
  },
  shapes: 'drawable.shapes',
  selectablePieces: 'selectable.enabled',
  resizable: 'resizable',
  eraseDrawableOnClick: 'drawable.eraseOnClick',
  animation: 'animation.enabled',
  allowAllMoves: (props, update) => {
    _set(update, 'movable.free', props.allowAllMoves);
    _set(
      update,
      'movable.color',
      props.movableColor || props.allowAllMoves
        ? 'both'
        : getTurnColor(props.fen),
    );
    (ChessgroundMappedProps.fen as Function)(props, update);
  },
  movableColor: 'movable.color',
  orientation: 'orientation',
};
