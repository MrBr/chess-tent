import styled from '@emotion/styled';
import React, { ComponentType, useCallback } from 'react';

import { Section, Step, isSection } from '@chess-tent/models';
import { StepComponentRenderer, StepSystemProps } from '../step';

type StepProps = {
  step: Step;
  className?: string;
  onStepClick?: (step: Step) => void;
} & StepSystemProps;

type StepperProps = {
  section: Section;
  current?: Step;
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
        <StepComponentRenderer
          component="Actions"
          step={step}
          {...systemProps}
        />
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
  ({ section, current, className, ...systemProps }) => {
    if (!section) {
      return null;
    }
    return (
      <div className={className}>
        <div className="line"></div>
        {section.children.map(child => {
          if (isSection(child)) {
            return (
              <Stepper
                section={child}
                key={`${child.id}-section`}
                current={current}
                {...systemProps}
              />
            );
          }
          return (
            <div className="step-container" key={`${child.id}-step`}>
              <StepMark step={child} current={child === current} />
              <StepperStep step={child} {...systemProps} />
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
  '.line': {
    position: 'absolute',
    left: 25,
    zIndex: 0,
    top: 0,
    width: 1,
    background: '#000',
    height: '100%',
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

const Action = styled.span({
  display: 'inline-block',
  padding: '0 10px',
});

export { StepperStep, StepMark, Stepper, Action };
