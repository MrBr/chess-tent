import React from 'react';
import { Step } from '@chess-tent/models';
import { AppStep } from '@types';
import styled from '@chess-tent/styled-props';

import ActivityStep from './activity-step';

interface ActivityStepperStepsProps {
  step?: AppStep;
  className?: string;
  onStepClick: (step: AppStep) => void;
  steps: Step[];
}

const ActivityStepperSteps = styled((props: ActivityStepperStepsProps) => {
  const { step, className, onStepClick, steps } = props;

  return (
    <>
      <div className={className}>
        {step && (
          <ActivityStep onClick={() => onStepClick(step)}>
            {step.stepType}
          </ActivityStep>
        )}
        {steps.map(child => {
          return (
            <div key={child.id} className={className}>
              <ActivityStepperSteps
                {...props}
                // Override current step
                steps={child.state.steps}
                step={child as AppStep}
                onStepClick={onStepClick}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}).css`
  & > & {
    margin-left: 10px;
  }
`;

export default ActivityStepperSteps;
