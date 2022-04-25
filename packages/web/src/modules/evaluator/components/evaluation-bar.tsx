import React, { ComponentType } from 'react';
import { ui } from '@application';
import styled from '@emotion/styled';
import { Evaluation } from '@types';

const { ProgressBar } = ui;

const EvaluationBar: ComponentType<{
  evaluation: Evaluation;
  className?: string;
}> = ({ evaluation, className }) => {
  return (
    <ProgressBar
      className={className}
      min={-15}
      max={15}
      now={evaluation.score || 0}
      label={evaluation.score || 0}
    />
  );
};

export default styled(EvaluationBar)({
  '.progress-bar': {
    backgroundColor: '#d0d0d0',
    color: '#2f3849',
  },
  height: 20,
  backgroundColor: '#2f3849',
});
