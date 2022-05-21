import React, { useEffect, useRef } from 'react';
import styled from '@chess-tent/styled-props';
import { Components } from '@types';

const Step = styled<Components['LessonPlaygroundStepTag']>(
  ({ children, className, onClick, active }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!active || !ref.current) {
        return;
      }
      ref.current.scrollIntoView();
    }, [active, ref]);

    return (
      <div className={`${className} $`} onClick={onClick} ref={ref}>
        {children}
      </div>
    );
  },
).props.active.visited.completed.css`
  &.active {
    background: var(--tertiary-color);
    color: var(--light-color);
  }
  
  &.visited:not(.active) {
    background: var(--grey-500-color);
  }
  
  &.completed:before {
    content: " ";
    position: absolute;
    right: -3.5px;
    top: -3.5px;
    border-radius: 50%;
    background: var(--secondary-color);
    width: 7px;
    height: 7px;
    display: inline-block;
    border: 1px solid var(--light-color);
  }

  & > & {
    margin-left: 15px;
  }
  margin-bottom: 8px;

  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 4px;
  border: 1px solid var(--grey-500-color);
`;

export default Step;
