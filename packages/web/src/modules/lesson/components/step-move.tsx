import React from 'react';
import { components, services } from '@application';
import { NotableMove, StepMove } from '@types';

const { PieceIcon } = components;
const { getSquareFile, getSquareRank } = services;

const isKingSideCastling = (move: NotableMove) =>
  move.piece.role === 'king' &&
  move.move[0].charAt(0) === 'e' &&
  move.move[1].charAt(0) === 'g';
const isQueenSideCastling = (move: NotableMove) =>
  move.piece.role === 'king' &&
  move.move[0].charAt(0) === 'e' &&
  move.move[1].charAt(0) === 'c';
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
  onClick,
}) => (
  <span className={className} onClick={() => onClick && onClick(move)}>
    {prefix}
    {move.index &&
      (move.piece?.color === 'black' ? blackIndexSign : `${move.index}.`)}
    {move.piece && <PieceIcon piece={move.piece} />}
    {move.rank && getSquareFile(move.move[0])}
    {move.file && getSquareRank(move.move[0])}
    {move.captured && 'x'}
    {getMoveAnnotation(move)}
    {suffix}
  </span>
);

StepMoveComponent.defaultProps = {
  blackIndexSign: '..',
};
export default StepMoveComponent;
