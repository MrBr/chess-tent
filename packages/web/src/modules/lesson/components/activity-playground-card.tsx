import React from 'react';
import styled from '@chess-tent/styled-props';
import { Components } from '@types';
import { ui } from '@application';

const { Card } = ui;

export default styled<Components['LessonPlaygroundCard']>(
  ({ children, className, onClick }) => (
    <Card className={className} onClick={onClick}>
      <Card.Body>{children}</Card.Body>
    </Card>
  ),
).props.active.bottom.stretch.css`
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
  &.bottom {
    margin-top: auto;
    order: 10;
    border-top: 1px solid var(--grey-400-color);
    border-bottom: 0;
    margin-bottom: 0;
  }
  width: calc(100% - 48px);
  margin-bottom: 24px;
  margin-left: 24px;
  border-radius: 8px;
`;
