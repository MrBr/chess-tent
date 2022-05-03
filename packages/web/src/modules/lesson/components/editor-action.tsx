import React, { ReactNode } from 'react';
import { ui } from '@application';

const { OverlayTrigger, Tooltip, Text } = ui;

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
      <div>
        <Text
          className="m-0 cursor-pointer"
          weight={400}
          fontSize="small"
          onClick={disabled ? undefined : onClick}
        >
          {children}
        </Text>
      </div>
    </OverlayTrigger>
  );
};

export default EditorAction;
