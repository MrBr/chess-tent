import React, { memo, ReactElement, useCallback } from 'react';
import { ui } from '@application';
import { Step } from '@chess-tent/models';

const { Container } = ui;

export interface RootStepContainerProps {
  setActiveStep?: (step: Step) => void;
  step: Step;
  children: ReactElement;
  className?: string;
}

const RootStepContainer = ({
  children,
  setActiveStep,
  step,
  className,
}: RootStepContainerProps) => {
  const handleStepClick = useCallback(
    event => {
      event.stopPropagation();
      setActiveStep && setActiveStep(step);
    },
    [setActiveStep, step],
  );
  return (
    <Container onClick={handleStepClick} fluid className={`${className} p-0`}>
      {children}
    </Container>
  );
};

export default memo(RootStepContainer);
