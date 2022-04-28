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
).css`
  :last-child {
    margin-bottom: 0;
  }
  margin-bottom: 24px;
  border-radius: 8px;
`;
