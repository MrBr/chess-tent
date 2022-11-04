import React, { useRef } from 'react';
import { hooks, ui } from '@application';

const { Dropdown, Overlay } = ui;
const { useOutsideClick } = hooks;

interface EditorSidebarStepContextMenuProps {
  container: HTMLElement;
  onClose: () => void;
  onPromoteVariation?: () => void;
}

const EditorSidebarStepContextMenu = ({
  container,
  onClose,
  onPromoteVariation,
}: EditorSidebarStepContextMenuProps) => {
  const ref = useRef(container);
  useOutsideClick(onClose, {
    current: container,
  });

  return (
    <Overlay container={ref} target={ref} show={true} placement="left">
      {() => {
        return (
          <Dropdown show>
            <Dropdown.Menu>
              {onPromoteVariation && (
                <Dropdown.Item onClick={onPromoteVariation}>
                  Promote variation
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        );
      }}
    </Overlay>
  );
};

export default EditorSidebarStepContextMenu;
