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
  return (
    <Container>
      {notableMoves.map(move => (
        <StepMove
          onClick={onMoveClick}
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
