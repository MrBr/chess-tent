import React from 'react';
import { ui, components, services, constants } from '@application';
import { StepRoot } from '@chess-tent/models';
import { Steps } from '@types';
import { css } from '@chess-tent/styled-props';

const { ChessboardPreview } = components;
const { Container } = ui;
const { getStepPosition } = services;
const { START_FEN } = constants;

const { className } = css`
  padding-bottom: 62.5%;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  > div {
    position: absolute;
    bottom: 0;
    left: 0;
    // style is set to match current board sizing
    width: 100%;
    height: 200%;
    transform: translateY(20%);
  }
`;

const Thumbnail = ({ stepRoot }: { stepRoot: StepRoot }) => {
  const step = stepRoot.state.steps[0];
  const initialPosition = step ? getStepPosition(step as Steps) : START_FEN;
  return (
    <Container className={className}>
      <div>
        <ChessboardPreview fen={initialPosition} />
      </div>
    </Container>
  );
};

export default Thumbnail;
