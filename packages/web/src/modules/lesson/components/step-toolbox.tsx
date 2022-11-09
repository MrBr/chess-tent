import React, { useEffect, useState } from 'react';
import { Components } from '@types';
import { hooks, ui, utils } from '@application';
import styled, { css } from '@chess-tent/styled-props';

const { Icon, Overlay } = ui;
const { useShowOnActive } = hooks;
const { stopPropagation } = utils;

const { className: toolboxContainerClassName } = css`
  position: absolute;
  left: 0;
`;

const { className: toolboxClassName } = css`
  z-index: 100;
`;

const ToolboxActions = styled.div.css`
  > ${Icon as any}:not(:last-child) {
    margin-bottom: 15px;
    cursor: pointer;
  }

  padding: 15px 8px;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  z-index: 10;
  background: var(--light-color);
  border: 1px solid var(--grey-400-color);
  border-radius: 10px;
`;

const StepToolbox: Components['StepToolbox'] = ({
  active,
  actionsClassName,
  children,
  containerSelector,
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  const toolboxRef = useShowOnActive<HTMLDivElement>(active);

  useEffect(() => {
    if (!active || !toolboxRef.current) {
      return;
    }
    const observer = new IntersectionObserver(
      entries => setVisible(!!entries[0]?.isIntersecting),
      {
        root: null, // default is the viewport
        threshold: 0.5, // percentage of taregt's visible area. Triggers "onIntersection"
      },
    );

    observer.observe(toolboxRef.current);
    return () => {
      observer.disconnect();
      // TODO - is observer deleted for sure?
    };
  }, [active, toolboxRef, setVisible]);

  // Used to prevent scrollbar flickering
  // TODO - make it configurable
  /** @see Editor */
  const getToolboxContainer = () =>
    (toolboxRef.current?.closest('.layout-content') as HTMLElement) || null;

  return (
    <>
      {active && visible && (
        <Overlay
          target={toolboxRef.current}
          placement="left"
          show
          container={getToolboxContainer}
        >
          {/* Excluding props to remove react warning... */}
          {({ arrowProps, popper, show, className, ...props }) => (
            // Stopping propagation to execute only clicked action
            // and not triggers bellow the toolbox
            <div
              {...props}
              onClick={stopPropagation}
              className={`${className} ${toolboxClassName}`}
            >
              <ToolboxActions className={actionsClassName}>
                {children}
              </ToolboxActions>
            </div>
          )}
        </Overlay>
      )}
      <div ref={toolboxRef} className={toolboxContainerClassName} />
    </>
  );
};

export default StepToolbox;
