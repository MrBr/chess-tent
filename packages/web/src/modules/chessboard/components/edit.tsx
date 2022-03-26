import React from 'react';
import { ui } from '@application';

const { ToggleButton } = ui;

const Edit = ({
  onChange,
  editing,
}: {
  editing: boolean;
  onChange?: (editing: boolean) => void;
}) => (
  <ToggleButton
    value={1}
    checked={!!editing}
    size="extra-small"
    onChange={() => onChange && onChange(!editing)}
  >
    {editing ? 'Done editing' : 'Edit board'}
  </ToggleButton>
);

export default Edit;
