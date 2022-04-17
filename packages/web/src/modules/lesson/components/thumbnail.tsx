import React from 'react';
import { ui, components, services } from '@application';
import { StepRoot } from '@chess-tent/models';
import { Steps } from '@types';
import { css } from '@chess-tent/styled-props';

const { Chessboard } = components;
const { Container } = ui;
const { getStepPosition } = services;

const { className } = css`
  padding-bottom: 62.5%;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  > div {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translateY(-60%);
  }
`;

const Thumbnail = ({ stepRoot }: { stepRoot: StepRoot }) => {
  return (
    <Container className={className}>
      <div>
        <Chessboard
          fen={getStepPosition(stepRoot.state.steps[0] as Steps)}
          footer={null}
          header={null}
          allowEvaluation={false}
          viewOnly={true}
          size="100%"
        />
      </div>
    </Container>
  );
};

export default Thumbnail;
