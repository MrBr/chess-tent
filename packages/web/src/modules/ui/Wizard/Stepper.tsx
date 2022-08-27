import React from 'react';
import { WizardStepperProps } from '@types';
import { css } from '@chess-tent/styled-props';

import { Text } from '../Text';
import Badge from '../Badge';

const { className } = css`
  display: flex;
  min-width: 100%;
  border-bottom: 1px solid var(--grey-300-color);
  .wizard-step {
    display: flex;
    align-items: center;
    flex: 1;
    padding-bottom: 8px;
  }
`;

const Stepper = <T extends {}, P extends {}>({
  activeStep,
  setActiveStep,
  steps,
  visitedSteps,
}: WizardStepperProps<T, P>) => {
  return (
    <div className={className}>
      {steps.map((step, index) => {
        const active = activeStep === step;
        const visited = visitedSteps.has(step);
        let badgeType = visited ? 'secondary' : 'neutral';

        if (active) {
          badgeType = 'secondary';
        }

        return (
          <div
            key={index}
            className="wizard-step"
            onClick={() => setActiveStep(step)}
            role="button"
            tabIndex={0}
          >
            {steps.length > 1 && (
              <Badge circle bg={badgeType}>
                {index}
              </Badge>
            )}
            <Text fontSize="extra-small" inline className="ms-2">
              {step.label}
            </Text>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
