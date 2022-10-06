import React from 'react';
import styled from '@chess-tent/styled-props';
import { Components } from '@types';
import { ui } from '@application';

const { Card } = ui;

export default styled<Components['LessonPlaygroundCard']>(
  ({ children, className, onClick, active }) => (
    <Card className={className} onClick={!active ? onClick : undefined}>
      <Card.Body>{children}</Card.Body>
    </Card>
  ),
).props.active.bottom.stretch.css`
  &:last-child {
    margin-bottom: 0;
  }
  &.active {
    border: 1px solid var(--black-color);
  }
  &.stretch {
    margin-left: 0;
    width: 100%;
    border: 0;
    border-radius: 0;
    border-bottom: 1px solid var(--grey-400-color);
  }
  width: calc(100% - 48px);
  margin-left: 24px;
  border-radius: 8px;
`;
