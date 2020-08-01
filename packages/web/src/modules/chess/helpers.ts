import { PieceColor, PieceRole } from '@types';

const typeRoleMap: { [key: string]: PieceRole } = {
  p: 'pawn',
  k: 'king',
  n: 'knight',
  r: 'rook',
  q: 'queen',
  b: 'bishop',
};

export const transformPieceTypeToRole = (
  type: keyof typeof typeRoleMap,
): PieceRole => {
  return typeRoleMap[type];
};

export const transformColorKey = (color: 'w' | 'b'): PieceColor => {
  return color === 'w' ? 'white' : 'black';
};
