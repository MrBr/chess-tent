import React, { ComponentType } from 'react';
import { components } from '@application';
import { Evaluation, NotableMove } from '@types';
import { getEvaluationMoves } from '../service';

const { StepMove } = components;

const EvaluationLines: ComponentType<{
  evaluation: Evaluation;
  className?: string;
  onMoveClick?: (move: NotableMove[]) => void;
}> = ({ evaluation, onMoveClick }) => {
  const notableMoves = getEvaluationMoves(evaluation);
  const handleMoveClick = (index: number) => {
    if (!onMoveClick) {
      return;
    }
    const movesToPlay = notableMoves.splice(0, index + 1);
    onMoveClick(movesToPlay);
  };
  return (
    <>
      {notableMoves.map((move, index) => (
        <StepMove
          onClick={() => handleMoveClick(index)}
          key={move.position}
          className="small"
          move={move}
          suffix=" "
        />
      ))}
    </>
  );
};

export default EvaluationLines;
