import React, { ReactNode, ComponentType } from 'react';
import styled from '@chess-tent/styled-props';
import { ClassNameProps, ClickProps } from '@types';

type ActivityStepProps = {
  children?: ReactNode;
  active?: boolean;
  visited?: boolean;
  completed?: boolean;
} & ClickProps &
  ClassNameProps;

const Step = styled<ComponentType<ActivityStepProps>>(
  ({ children, className, onClick }) => {
    return (
      <div className={className} onClick={onClick}>
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

  height: 30px;
  padding: 0 0.5rem;
  margin-right: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 4px;
  border: 1px solid var(--grey-500-color);
`;

export default Step;
