import React, { useCallback } from 'react';
import { Components } from '@types';
import styled from '@emotion/styled';
import { debounce } from 'lodash';
import { ui } from '@application';

const { Text } = ui;

export const ToolboxText = styled<Components['LessonToolboxText']>(
  ({ text, onChange, ...props }) => {
    // Updating div html resets the cursor so ToolboxText can't be controlled.
    // Ref is used to set static default value which won't change on props update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedTextChange = useCallback(
      debounce(onChange as (text: string) => void, 500, { trailing: true }),
      //
      // NOTE - no dependencies
      // ToolboxText is re-rendering a lot without this - seems unnecessary.
      [],
    );
    const onTextChange = useCallback(
      e => {
        if (e.target.innerText.trim() === '') {
          // Don't allow new line without any text it breaks the placeholder
          // Placeholder is shown when there is no text and whitespace breaks it
          e.target.innerHTML = '';
        }
        debouncedTextChange && debouncedTextChange(e.target.innerHTML);
      },
      [debouncedTextChange],
    );
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
        onInput={onTextChange}
      />
    );
  },
)(
  {
    '&:focus': {
      outline: 0,
    },
    color: '#2F3849',
    fontSize: 13 / 16 + 'em',
    cursor: 'pointer',
    margin: 0,
  },
  ({ placeholder }) => ({
    '&:empty:before': {
      content: `"${placeholder || ''}"`,
      color: '#A3A7AE',
    },
  }),
);

ToolboxText.defaultProps = {
  onChange: () => {},
};

export { ToolboxText as default };
