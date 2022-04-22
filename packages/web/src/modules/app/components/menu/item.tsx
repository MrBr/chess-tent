import React, { ReactNode, ReactElement } from 'react';
import styled from '@chess-tent/styled-props';
import { hooks, ui } from '@application';
import { Icons } from '@types';

interface ItemProps {
  className?: string;
  icon: Icons | ReactElement;
  label: ReactNode;
  path?: string;
  break?: boolean;
  onClick?: () => void;
  bottom?: boolean;
}

const { Icon, Text } = ui;
const { useHistory } = hooks;

const Item = styled<ItemProps>(({ className, path, label, icon, onClick }) => {
  const history = useHistory();
  const active = history.location.pathname === path;
  const handleClick = onClick || (() => path && history.push(path));
  return (
    <div
      className={`${active ? 'active' : ''} ${className}`}
      onClick={handleClick}
    >
      {typeof icon === 'string' ? <Icon type={icon} size="small" /> : icon}
      <Text className="mb-0" fontSize="extra-small">
        {label}
      </Text>
    </div>
  );
}).props.break.bottom.css`
  width: calc(100% - 26px);
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


  > ${Text as any} {
    color: var(--light-color);
    margin-left: 10px;
  }
  
  *:not(:hover) > & > ${Text as any} {
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
