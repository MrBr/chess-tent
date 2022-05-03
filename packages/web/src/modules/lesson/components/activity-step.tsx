import React from 'react';
import styled from '@chess-tent/styled-props';
import { Components } from '@types';

const Step = styled<Components['LessonPlaygroundStepTag']>(
  ({ children, className, onClick }) => {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    );
  },
).props.active.css`
  &.active {
    background: var(--tertiary-color);
    color: var(--light-color);
  }

  & > & {
    margin-left: 15px;
  }

  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 4px;
  border: 1px solid var(--grey-500-color);
  overflow: hidden;
`;

export default Step;
