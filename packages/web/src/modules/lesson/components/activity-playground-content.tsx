import React, { useState } from 'react';
import { ui, utils } from '@application';
import styled, { useCss } from '@chess-tent/styled-props';
import { Components } from '@types';
import { isMobile } from 'react-device-detect';

const { Card } = ui;
const { mobileCss } = utils;

const style = styled.props.collapsed.empty.css`
  height: 80px;
  position: relative;
  width: 100%;

  .card {
    position: absolute;
    border-radius: 8px;
    width: 100%;
    background: var(--light-color);
    z-index: 100;
    min-height: 100%;
  }

  &.collapsed .card {
    max-height: 80px;
  }

  .card-body {
    padding: 5px 8px;
  }

  .collapse-button {
    position: absolute;
    bottom: 0;
    right: 0;
    background: var(--grey-600-color);
    color: var(--light-color);
    border-radius: 10px 0 0 0;
    font-weight: 300;
    font-size: 14px;
    width: 60px;
    padding: 0 5px;
    box-sizing: content-box;
    text-align: center;
  }

  &.empty .collapse-button {
    display: none;
  }

  ${mobileCss`
    height: 30px;
    
    .card {
      right: 0;
      width: 90vw;
    }
    &.collapsed .card-body{
      display: none;
    }
  `}
`;

const LessonPlaygroundContent: Components['LessonPlaygroundContent'] = ({
  children,
  empty,
}) => {
  const [collapsed, setCollapsed] = useState(empty);
  const className = useCss(style)({ collapsed, empty });

  const collapseButton = (
    <span className="collapse-button" onClick={() => setCollapsed(!collapsed)}>
      {collapsed ? 'Expand' : 'Collapse'}
    </span>
  );

  let content = (
    <Card>
      <Card.Body>{children}</Card.Body>
      {collapseButton}
    </Card>
  );

  if (isMobile && collapsed) {
    content = collapseButton;
  }

  return <div className={className}> {content}</div>;
};

export default LessonPlaygroundContent;
