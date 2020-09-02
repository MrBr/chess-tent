import styled from '@emotion/styled';
import React, { ComponentType } from 'react';
import { components } from '@application';
import { StepperProps } from '@types';

const { StepRenderer } = components;

const Stepper = styled<ComponentType<StepperProps>>(
  ({ steps, activeStep, className, header, ...systemProps }) => {
    if (!steps) {
      return null;
    }
    return (
      <div className={className}>
        {header}
        {steps.map(child => {
          return (
            <StepRenderer<'StepperStep'>
              component="StepperStep"
              step={child}
              key={`${child.id}-step`}
              activeStep={activeStep}
              {...systemProps}
            />
          );
        })}
      </div>
    );
  },
)({
  '& > &': {
    width: 'calc(100% - 50px)',
    left: 50,
  },
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '100%',
  background: '#D1D3D7',
});

export { Stepper };
