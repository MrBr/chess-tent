import styled from '@emotion/styled';
import React, { ComponentType } from 'react';

import { Section, Steps, StepSystemProps } from '../app/types';
import { StepComponentRenderer } from '../app';
import { isSection } from './service';

type StepProps = {
  step: Steps;
  className?: string;
} & StepSystemProps;

type StepperProps = {
  section: Section;
  current?: Steps;
  className?: string;
} & StepSystemProps;

const Step = styled<ComponentType<StepProps>>(
  ({ step, className, ...systemProps }) => {
    return (
      <div className={className}>
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
    background: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ({ current }) =>
    current && {
      background: 'red',
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
                {...systemProps}
              />
            );
          }
          return (
            <div className="step-container" key={`${child.id}-step`}>
              <StepMark step={child} current={child === current} />
              <Step step={child} {...systemProps} />
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

export { Step, StepMark, Stepper, Action };
