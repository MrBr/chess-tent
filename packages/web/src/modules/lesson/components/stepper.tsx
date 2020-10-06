import styled from '@emotion/styled';
import React from 'react';
import { components } from '@application';
import { StepperProps } from '@types';

const { StepRenderer } = components;

const StepperVariation = styled.div({
  paddingLeft: 10,
  marginLeft: 10,
  borderLeft: '1px solid #D1D3D7',
  position: 'relative',
});

const Stepper = ({
  steps,
  activeStep,
  className,
  ...systemProps
}: StepperProps) => {
  if (!steps) {
    return null;
  }
  return (
    <>
      {steps.map(child => {
        return (
          <StepRenderer<'StepperStep'>
            component="StepperStep"
            key={`${child.id}-step`}
            activeStep={activeStep}
            {...systemProps}
            step={child}
          />
        );
      })}
    </>
  );
};

export { Stepper, StepperVariation as StepperStepContainer };
