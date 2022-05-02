import React, { ComponentType } from 'react';
import { ui } from '@application';
import styled from '@chess-tent/styled-props';
import { Evaluation } from '@types';

const { ProgressBar } = ui;

const EvaluationBar: ComponentType<{
  evaluation: Evaluation;
  className?: string;
}> = ({ evaluation, className }) => {
  return (
    <ProgressBar
      className={className}
      min={-10}
      max={10}
      now={evaluation.score || 0}
      label={evaluation.score || 0}
    />
  );
};

export default styled(EvaluationBar).css`
  .progress-bar {
    background-color: #d0d0d0;
    color: #2f3849;
    border-radius: unset;
  }
  height: 20px;
  background-color: #2f3849;
`;
