import React from 'react';
import { ui } from '@application';
import { ActivityFooterProps } from '@types';

const { Container, Button } = ui;

export default ({
  next,
  prev,
  currentStep,
  stepsCount,
}: ActivityFooterProps) => {
  return (
    <Container>
      <div>
        {currentStep}/{stepsCount}
      </div>
      <Button onClick={prev}>Prev</Button>
      <Button onClick={next}>Next</Button>
    </Container>
  );
};
