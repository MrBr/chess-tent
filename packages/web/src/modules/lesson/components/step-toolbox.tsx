import React, { useCallback, useRef } from 'react';
import { Components, StepToolbox } from '@types';
import { ui } from '@application';
import styled from '@emotion/styled';
import { debounce } from 'lodash';

const { Container, Button } = ui;

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
        onChange && debouncedTextChange(e.target.innerText);
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

const ToolboxActions = styled.div({
  '> button': {
    marginBottom: 8,
  },
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
});

export default (({
  textChangeHandler,
  active,
  text,
  addStepHandler,
  addExerciseHandler,
  deleteStepHandler,
}) => {
  return (
    <Container className="d-flex align-items-center h-100">
      {(text || active) && (
        <ToolboxText
          onChange={textChangeHandler}
          defaultText={text}
          placeholder="Add comment"
        />
      )}
      {active && (
        <ToolboxActions>
          {addExerciseHandler && (
            <Button
              variant="regular"
              size="extra-small"
              onClick={addExerciseHandler}
            >
              Q
            </Button>
          )}
          {addStepHandler && (
            <Button
              size="extra-small"
              variant="regular"
              onClick={addStepHandler}
            >
              +
            </Button>
          )}
          {deleteStepHandler && (
            <Button
              size="extra-small"
              variant="regular"
              onClick={deleteStepHandler}
            >
              x
            </Button>
          )}
        </ToolboxActions>
      )}
    </Container>
  );
}) as StepToolbox;
