import React, { ReactNode } from 'react';
import { ui } from '@application';

const { Dropdown, OverlayTrigger, Tooltip } = ui;

export default ({
  children,
  tooltip,
  id,
  onClick,
  disabled,
}: {
  id: string;
  children: ReactNode;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <OverlayTrigger
      placement="left"
      overlay={<Tooltip id={`editor-action-${id}`}>{tooltip}</Tooltip>}
    >
      <Dropdown.Item onClick={disabled ? undefined : onClick}>
        {children}
      </Dropdown.Item>
    </OverlayTrigger>
  );
};
