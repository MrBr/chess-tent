import React from 'react';
import { Components } from '@types';
import styled, { css } from '@chess-tent/styled-props';
import { ui, utils } from '@application';

const { Input } = ui;
const { autosizeTextarea } = utils;

export const ToolboxText = styled<Components['LessonToolboxText']>(
  ({ text, onChange, onKeyDown, className, active, ...props }) => {
    // This trick re-renders component when it becomes active and thus trigger autofous
    const key = active ? 'active' : 'inactive';
    return (
      <Input
        {...props}
        as="textarea"
        key={key}
        className={className}
        disabled={!active}
        rows={1}
        ref={autosizeTextarea}
        onKeyDown={onKeyDown}
        defaultValue={text}
        autoFocus
        onChange={e => onChange && onChange(e.currentTarget.value)}
      />
    );
  },
).css`
  &:focus {
    outline: 0;
  }
  
  &:disabled {
    border: none !important;
    background-color: transparent;
    cursor: pointer;
  }

  color: #2F3849;
  font-size: 1rem;
  font-weight: 400;
  background-color: transparent;
  cursor: pointer;
  margin: 0;
  ${({ placeholder }) => css`
    &:empty:before {
      content: '${placeholder || ''}';
      color: #a3a7ae;
    }
  `}
`;

ToolboxText.defaultProps = {
  onChange: () => {},
};

export { ToolboxText as default };
