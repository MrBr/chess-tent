import styled from '@chess-tent/styled-props';
import React from 'react';
import { StepTag } from '@types';

export default styled<StepTag>(({ children, className, onClick }) => (
  <span className={className} onClick={onClick}>
    <span>{children}</span>
  </span>
)).props.active.css`
  &.active > span {
    background: var(--tertiary-color);
    color: var(--light-color);
  }

  & > span {
    background: transparent;
    display: inline-block;
    padding: 4px 8px;
    border-radius: 6px;
  }

  color: #2F3849;
  display: inline-block;
  overflow: hidden;
  font-weight: 700;
  font-size: 12px;
`;
