import React, { useCallback, UIEvent } from 'react';
import { Components } from '@types';
import styled, { css } from '@chess-tent/styled-props';
import { ui } from '@application';

const { Text } = ui;

const formatToolboxText = (e: UIEvent<HTMLDivElement>) => {
  if (e.currentTarget.innerText.trim() === '') {
    // Don't allow new line without any text it breaks the placeholder
    // Placeholder is shown when there is no text and whitespace breaks it
    e.currentTarget.innerHTML = '';
  }
};

export const ToolboxText = styled<Components['LessonToolboxText']>(
  ({ text, onChange, ...props }) => {
    const onPaste = useCallback(event => {
      event.preventDefault();

      const text = (
        event.clipboardData ||
        (window as unknown as { clipboardData: Clipboard }).clipboardData
      ).getData('text');

      document.execCommand('insertHTML', false, text);
    }, []);

    return (
      <Text
        contentEditable={!!onChange}
        {...props}
        onPaste={onPaste}
        html={text}
        onInput={onChange}
        formatInput={formatToolboxText}
      />
    );
  },
).css`
  &:focus {
    outline: 0;
  }

  color: #2F3849;
  font-size: 0.8rem;
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
