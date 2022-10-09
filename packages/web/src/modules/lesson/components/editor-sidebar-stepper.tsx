import React from 'react';
import { components } from '@application';
import { StepperProps, Steps } from '@types';

import RootStepContainer from './editor-sidebar-root-step-container';
import StepperVariation from './editor-sidebar-variation-container';

const { StepRenderer } = components;

const Stepper = ({
  activeStep,
  root,
  className,
  ...systemProps
}: StepperProps) => {
  const steps = systemProps.stepRoot.state.steps;
  if (!steps) {
    return null;
  }
  return (
    <>
      {steps.map((child, index) => {
        const stepper = (
          <StepRenderer
            component="EditorSidebar"
            activeStep={activeStep}
            key={`step-${child.id}`}
            {...systemProps}
            // Override current step
            step={child as Steps}
          />
        );
        return child.stepType === 'variation' && !root ? (
          <StepperVariation key={`variation-${child.id}`}>
            <RootStepContainer
              step={child}
              className={root && index > 0 ? 'mt-4' : ''}
            >
              {stepper}
            </RootStepContainer>
          </StepperVariation>
        ) : (
          stepper
        );
      })}
    </>
  );
};

export { Stepper };
