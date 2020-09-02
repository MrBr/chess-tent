import React, { useCallback, useRef } from 'react';
import { StepToolbox } from '@types';
import { ui } from '@application';
import styled from '@emotion/styled';

const { Container, Row, Col, Button } = ui;

const ToolboxText = styled(props => {
  const defaultValueRef = useRef(props.text);
  return (
    <div
      contentEditable
      dangerouslySetInnerHTML={{ __html: defaultValueRef.current }}
      {...props}
    />
  );
})({
  '&:empty:before': {
    content: '"Add comment..."',
    color: '#A3A7AE',
  },
  '&:focus': {
    outline: 0,
  },
  color: '#2F3849',
  fontSize: 13 / 16 + 'em',
  cursor: 'pointer',
});

const ToolboxActions = styled.div({
  '> button': {
    marginBottom: 8,
  },
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  right: 0,
  top: 0,
  zIndex: 10,
});

export default (({ textChangeHandler, active, text, addStepHandler }) => {
  const onTextChange = useCallback(
    e => {
      textChangeHandler && textChangeHandler(e.target.innerText);
    },
    [textChangeHandler],
  );
  return (
    <Container className="d-flex align-items-center h-100">
      {(text || active) && <ToolboxText onInput={onTextChange} text={text} />}
      {active && (
        <ToolboxActions>
          <Button variant="regular" size="extra-small">
            Q
          </Button>
          <Button size="extra-small" variant="regular" onClick={addStepHandler}>
            +
          </Button>
        </ToolboxActions>
      )}
    </Container>
  );
}) as StepToolbox;
