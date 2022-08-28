import React from 'react';
import { hooks } from '@application';
import styled from '@chess-tent/styled-props';
import { Components } from '@types';

const { useHistory } = hooks;

const TabButton = styled<Components['TabBar']['TabButton']>(
  ({ className, path, children }) => {
    const history = useHistory();
    const active = history.location.pathname === path;
    return (
      <div
        className={`${className} ${active ? 'active' : ''}`}
        onClick={() => !!path && history.push(path)}
      >
        {children}
      </div>
    );
  },
).css`
  &.active svg {
    opacity: 1;
  }

  svg {
    opacity: 0.4;
    margin-bottom: 0.4em;
  }

  height: 100%;
  display: flex;
  align-items: center;
  flex: 1 1 30%;
  flex-direction: column;
  justify-content: center;
  font-weight: 700;
  font-size: 8px;
  cursor: pointer;
  color: #182235;
  text-transform: uppercase;
`;

export default TabButton;
