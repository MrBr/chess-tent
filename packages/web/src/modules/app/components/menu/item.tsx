import React, { ReactNode } from 'react';
import styled from '@chess-tent/styled-props';
import { hooks, ui } from '@application';
import { Icons } from '@types';

interface ItemProps {
  children?: ReactNode;
  className?: string;
  icon?: Icons;
  label?: ReactNode;
  path?: string;
  break?: boolean;
  onClick?: () => void;
  bottom?: boolean;
}

const { Icon, Text } = ui;
const { useHistory } = hooks;

export const ItemLabel = styled(Text).css`
  margin-left: 10px;
  margin-bottom: 0;
`;
ItemLabel.defaultProps = {
  fontSize: 'extra-small',
  color: 'light',
};

const Item = styled<ItemProps>(
  ({ children, className, path, label, icon, onClick }) => {
    const history = useHistory();
    const active = history.location.pathname === path;
    const handleClick = onClick || (() => path && history.push(path));
    return (
      <div
        className={`${active ? 'active' : ''} ${className}`}
        onClick={handleClick}
      >
        {children || (
          <>
            {icon && <Icon type={icon} size="small" />}
            <ItemLabel>{label}</ItemLabel>
          </>
        )}
      </div>
    );
  },
).props.break.bottom.css`
  width: calc(100% - 22px);
  height: 48px;
  align-items: center;
  display: flex;
  border-radius: 10px;
  padding: 10px;
  position: relative;
  flex: 0;
  cursor: pointer;

  &.bottom {
    margin-top: auto;
  }
  
  &.break {
    margin-bottom: 15px;

    &:after {
      position: absolute;
      bottom: 2px;
      left: 0;
      content: " ";
      width: 100%;
      background: var(--light-color-02);
      height: 1px;
      display: inline-block;
    }
  }

  *:not(:hover) > &  ${ItemLabel as any} {
    display: none;
  }

  &.active {
    background: var(--light-color-02);
  }

  ${Icon as any} {
    color: var(--light-color);
  }
`;

export default Item;
