import React from 'react';
import { components, ui } from '@application';
import { ChessboardFooterProps } from '@types';

const { EditBoardToggle } = components;
const { Button } = ui;

export default ({ updateEditing, editing, onReset }: ChessboardFooterProps) => (
  <>
    {updateEditing && (
      <EditBoardToggle editing={editing} onChange={updateEditing} />
    )}
    {onReset && (
      <Button size="extra-small" variant="regular" onClick={onReset}>
        Reset
      </Button>
    )}
  </>
);
