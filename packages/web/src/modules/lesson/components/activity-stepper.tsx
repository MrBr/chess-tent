import React from 'react';
import { StepRoot } from '@chess-tent/models';
import { AppStep } from '@types';
import styled from '@emotion/styled';

import Step from './activity-step';

const Stepper = styled(
  ({
    root,
    step,
    className,
    onStepClick,
  }: {
    root: StepRoot;
    step?: AppStep;
    className?: string;
    onStepClick: (step: AppStep) => void;
  }) => {
    const steps = (step || root).state.steps;
    if (!steps) {
      return null;
    }

    return (
      <>
        {step && <Step onClick={() => onStepClick(step)}>{step.stepType}</Step>}
        {steps.map(child => {
          return (
            <>
              <div className={className}>
                <Stepper
                  root={root}
                  // Override current step
                  step={child as AppStep}
                  onStepClick={onStepClick}
                />
              </div>
            </>
          );
        })}
      </>
    );
  },
)({
  '& > &': {
    marginLeft: 10,
  },
});

export default Stepper;