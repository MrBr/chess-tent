import React, { ReactNode } from 'react';
import { ui } from '@application';

const { OverlayTrigger, Tooltip } = ui;

const EditorAction = ({
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
      <div className="cursor-pointer" onClick={disabled ? undefined : onClick}>
        {children}
      </div>
    </OverlayTrigger>
  );
};

export default EditorAction;
