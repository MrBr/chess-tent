import React, { useState } from 'react';
import { ui } from '@application';
import styled, { useCss } from '@chess-tent/styled-props';
import { Components } from '@types';

const { Card } = ui;

const style = styled.props.collapsed.css`
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
`;

const LessonPlaygroundContent: Components['LessonPlaygroundContent'] = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const className = useCss(style)({ collapsed });

  return (
    <div className={className}>
      <Card>
        <Card.Body>{children}</Card.Body>
        <span
          className="collapse-button"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? 'Expand' : 'Collapse'}
        </span>
      </Card>
    </div>
  );
};

export default LessonPlaygroundContent;
