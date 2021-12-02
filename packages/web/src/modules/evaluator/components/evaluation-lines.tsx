import React from 'react';
import { ui, components, services } from '@application';
import { Components, Move, PieceRoleShortPromotable } from '@types';

const { Container } = ui;
const { StepMove } = components;
const {
  Chess,
  uciToSan,
  extendRole,
  createNotableMove,
  createPiece,
} = services;

const EvaluationLines: Components['EvaluationLines'] = ({
  evaluation,
  position,
}) => {
  const game = new Chess(position);
  const notableMoves = evaluation.variation
    .slice(0, 5)
    .map((uciMove, index) => {
      const shortMove = game.move(uciToSan(uciMove));
      if (!shortMove) {
        throw Error('Invalid evaluation variation move.');
      }
      const { captured, from, to, promotion, color } = shortMove;
      const newPosition = game.fen();
      const move = [from, to] as Move;
      const promoted = extendRole(promotion as PieceRoleShortPromotable);
      const piece = createPiece(
        extendRole(shortMove.piece),
        color === 'w' ? 'white' : 'black',
        !!promoted,
      );
      return createNotableMove(
        newPosition,
        move,
        Math.floor(index / 2) + 1, // TODO - show real move index (take it from position)
        piece,
        !!captured,
        promoted,
      );
    });
  return (
    <Container>
      {notableMoves.map(move => (
        <StepMove className="small" move={move} suffix=" " />
      ))}
    </Container>
  );
};

export default EvaluationLines;
