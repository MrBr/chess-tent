import React, { useCallback } from 'react';
import { Components } from '@types';
import styled from '@emotion/styled';
import { debounce } from 'lodash';
import { ui } from '@application';

const { Text } = ui;

export const ToolboxText: Components['LessonToolboxText'] = styled(
  ({ defaultText, onChange, ...props }) => {
    // Updating div html resets the cursor so ToolboxText can't be controlled.
    // Ref is used to set static default value which won't change on props update.
    const debouncedTextChange =
      onChange &&
      useCallback(debounce(onChange, 500, { trailing: true }), [onChange]);
    const onTextChange = useCallback(
      e => {
        if (e.target.innerText.trim() === '') {
          // Don't allow new line without any text it breaks the placeholder
          // Placeholder is shown when there is no text and whitespace breaks it
          e.target.innerHTML = '';
        }
        onChange && debouncedTextChange(e.target.innerHTML);
      },
      [onChange, debouncedTextChange],
    );

    return (
      <Text
        contentEditable={!!onChange}
        {...props}
        initialHtml={defaultText}
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

export { ToolboxText as default };
