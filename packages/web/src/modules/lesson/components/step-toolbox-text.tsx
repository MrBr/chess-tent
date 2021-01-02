import React, { useCallback, useRef } from 'react';
import { Components } from '@types';
import styled from '@emotion/styled';
import { debounce } from 'lodash';

export const ToolboxText: Components['LessonToolboxText'] = styled(
  ({ defaultText, onChange, ...props }) => {
    // Updating div html resets the cursor so ToolboxText can't be controlled.
    // Ref is used to set static default value which won't change on props update.
    const defaultValueRef = useRef(defaultText);
    const debouncedTextChange =
      onChange &&
      useCallback(debounce(onChange, 500, { trailing: true }), [onChange]);
    const onTextChange = useCallback(
      e => {
        onChange && debouncedTextChange(e.target.innerHTML);
      },
      [onChange, debouncedTextChange],
    );

    return (
      <div
        contentEditable
        dangerouslySetInnerHTML={{ __html: defaultValueRef.current }}
        {...props}
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
  },
  ({ placeholder }) => ({
    '&:empty:before': {
      content: `"${placeholder || 'Type here..'}"`,
      color: '#A3A7AE',
    },
  }),
);

export { ToolboxText as default };
