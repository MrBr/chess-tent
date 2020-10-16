import React, { ComponentProps } from 'react';
import { ui } from '@application';
import { Components } from '@types';

const { ToggleButton } = ui;

export default ({
  onChange,
  editing,
}: ComponentProps<Components['EditBoardToggle']>) => (
  <ToggleButton
    value={1}
    defaultChecked={editing}
    checked={editing}
    size="extra-small"
    onChange={() => onChange(!editing)}
  >
    {editing ? 'Done editing' : 'Edit board'}
  </ToggleButton>
);
