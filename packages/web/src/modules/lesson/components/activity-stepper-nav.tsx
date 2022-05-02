import React from 'react';
import { ui } from '@application';
import styled from '@chess-tent/styled-props';

import { ActivityStepperProps } from './activity-stepper';

const { Icon, Button } = ui;

interface ActivityStepperNavProps {
  next: ActivityStepperProps['next'];
  prev: ActivityStepperProps['prev'];
  className?: string;
}

const ActivityStepperNav = styled(
  ({ next, prev, className }: ActivityStepperNavProps) => {
    return (
      <div className={className}>
        <Button variant="ghost" size="extra-small" onClick={prev}>
          <Icon type="left" />
        </Button>
        <Button variant="ghost" size="extra-small" onClick={next}>
          <Icon type="right" />
        </Button>
      </div>
    );
  },
).css`
  > ${Button as any} {
    padding: 0 6px;
  }
  background-color: var(--light-color);
  padding: 16px;
  display: flex;
  justify-content: space-around;
`;

export default ActivityStepperNav;
