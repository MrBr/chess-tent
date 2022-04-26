import React from 'react';
import { ui } from '@application';

const { Icon, OverlayTrigger, Tooltip } = ui;

const Edit = ({
  onChange,
  editing,
}: {
  editing: boolean;
  onChange?: (editing: boolean) => void;
}) => (
  <OverlayTrigger overlay={<Tooltip>Toggle edit mode</Tooltip>}>
    <Icon
      type={editing ? 'editFilled' : 'edit'}
      onClick={() => onChange && onChange(!editing)}
    />
  </OverlayTrigger>
);

export default Edit;
