import styled from '@emotion/styled';
import React from 'react';
import { components } from '@application';
import { StepperProps } from '@types';

const { StepRenderer } = components;

const StepperVariation = styled.div({
  paddingLeft: 10,
  marginLeft: 10,
  marginTop: 10,
  marginBottom: 10,
  borderLeft: '1px solid #D1D3D7',
  position: 'relative',
});

const Stepper = ({
  steps,
  activeStep,
  root,
  className,
  ...systemProps
}: StepperProps) => {
  if (!steps) {
    return null;
  }
  return (
    <>
      {steps.map(child => {
        const stepper = (
          <StepRenderer
            component="StepperStep"
            key={`${child.id}-step`}
            activeStep={activeStep}
            {...systemProps}
            // Override current step
            step={child}
          />
        );
        return child.stepType === 'variation' && !root ? (
          <StepperVariation>{stepper}</StepperVariation>
        ) : (
          stepper
        );
      })}
    </>
  );
};

export { Stepper, StepperVariation as StepperStepContainer };
