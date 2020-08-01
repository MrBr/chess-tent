import styled from '@emotion/styled';
import React, { ComponentType, useCallback } from 'react';
import { components } from '@application';
import { Step } from '@chess-tent/models';
import { ActionProps, StepperProps, StepSystemProps } from '@types';

const { StepRenderer } = components;

type StepProps = {
  step: Step;
  className?: string;
  onStepClick?: (step: Step) => void;
} & StepSystemProps;

const StepperStep = styled<ComponentType<StepProps>>(
  ({ step, className, onStepClick, ...systemProps }) => {
    const onClick = useCallback(() => {
      onStepClick && onStepClick(step);
    }, [step, onStepClick]);
    return (
      <div className={className} onClick={onClick}>
        <StepRenderer component="Actions" step={step} {...systemProps} />
      </div>
    );
  },
)({
  flex: 1,
});

const StepMark = styled(({ step, className }) => {
  return <span className={className} />;
})(
  {
    flex: '0 0 20px',
    height: 20,
    marginLeft: 15,
    borderRadius: '50%',
    background: '#5d5d5d',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ({ current }) =>
    current && {
      background: '#000',
    },
);

const Stepper = styled<ComponentType<StepperProps>>(
  ({ steps, activeStep, className, ...systemProps }) => {
    if (!steps) {
      return null;
    }
    return (
      <div className={className}>
        {steps.map(child => {
          return (
            <div className="step-container" key={`${child.id}-step`}>
              <StepMark step={child} current={child === activeStep} />
              <StepperStep
                step={child}
                {...systemProps}
                activeStep={activeStep}
              />
            </div>
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
  '.step-container': {
    display: 'flex',
    margin: '20px 0',
    flex: '0 0 0',
  },
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: 300,
  height: '100%',
  maxHeight: '100%',
});

const Action = styled.span<ActionProps>({
  display: 'inline-block',
  padding: '0 10px',
});

export { Stepper, Action };
