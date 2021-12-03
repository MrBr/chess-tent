import React from 'react';
import { ui, components } from '@application';
import { Components } from '@types';
import { getEvaluationMoves } from '../service';

const { Container } = ui;
const { StepMove } = components;

const EvaluationLines: Components['EvaluationLines'] = ({
  evaluation,
  onMoveClick,
}) => {
  const notableMoves = getEvaluationMoves(evaluation);
  const handleMoveClick = (index: number) => {
    if (!onMoveClick) {
      return;
    }
    const movesToPlay = notableMoves.splice(0, index + 1);
    onMoveClick(movesToPlay);
  };
  return (
    <Container>
      {notableMoves.map((move, index) => (
        <StepMove
          onClick={() => handleMoveClick(index)}
          key={move.position}
          className="small"
          move={move}
          suffix=" "
        />
      ))}
    </Container>
  );
};

export default EvaluationLines;
