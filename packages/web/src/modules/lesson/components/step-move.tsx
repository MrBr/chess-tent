import React from 'react';
import { components } from '@application';
import { NotableMove, StepMove } from '@types';

const { PieceIcon } = components;

const isKingSideCastling = (move: NotableMove) =>
  move.piece.role === 'king' && move.move[0] === 'e1' && move.move[1] === 'g1';
const isQueenSideCastling = (move: NotableMove) =>
  move.piece.role === 'king' && move.move[0] === 'e1' && move.move[1] === 'c1';
const getMoveAnnotation = (move: NotableMove) => {
  if (move.piece.role === 'king') {
    return isKingSideCastling(move)
      ? 'O-O'
      : isQueenSideCastling(move)
      ? 'O-O-O'
      : move.move[1];
  }
  return move.move[1];
};
const StepMoveComponent: StepMove = ({
  className,
  move,
  prefix,
  suffix,
  blackIndexSign,
}) => (
  <span className={className}>
    {prefix}
    {move.index &&
      (move.piece?.color === 'black' ? blackIndexSign : `${move.index}.`)}
    {move.piece && <PieceIcon piece={move.piece} />}
    {move.captured && 'x'}
    {getMoveAnnotation(move)}
    {suffix}
  </span>
);

StepMoveComponent.defaultProps = {
  blackIndexSign: '..',
};
export default StepMoveComponent;
