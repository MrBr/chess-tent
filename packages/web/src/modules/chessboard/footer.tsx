import React from 'react';
import { components, ui } from '@application';
import { ChessboardFooterProps } from '@types';

const { EditBoardToggle } = components;
const { Button, Col } = ui;

export default ({
  updateEditing,
  editing,
  onReset,
  onClear,
}: ChessboardFooterProps) => (
  <>
    {updateEditing && (
      <EditBoardToggle editing={editing} onChange={updateEditing} />
    )}
    <Col className="col-auto">
      {onReset && (
        <Button
          size="extra-small"
          variant="regular"
          onClick={onReset}
          className="mr-3"
        >
          Reset
        </Button>
      )}
      {onClear && (
        <Button size="extra-small" variant="regular" onClick={onClear}>
          Clear
        </Button>
      )}
    </Col>
  </>
);
