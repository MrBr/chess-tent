import React, { useRef, useState } from 'react';
import { components, hooks, ui } from '@application';
import { Components } from '@types';
import { css } from '@chess-tent/styled-props';
import Item from './item';

const { Container } = ui;
const { useOutsideClick } = hooks;
const { UserSettings } = components;

const style = css`
  height: 100%;
  position: relative;
  overflow-y: clip;

  &:not(.collapsed) > div {
    width: 260px;
  }

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1000;
    background: var(--black-color);
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }
`;

const Menu: Components['Menu'] = () => {
  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef();
  const className = `${open ? '' : 'collapsed'} ${style.className} g-0`;

  useOutsideClick(() => setOpen(false), containerRef);

  return (
    <Container className={className} ref={containerRef}>
      <div>
        <Item
          onClick={() => setOpen(!open)}
          icon="logo"
          label="ChessTent"
          break
        />
        <Item icon="notification" path="/" label="Dashboard" />
        <Item icon="notification" path="/coaches" label="Coaches" />
        <Item icon="notification" path="/lessons" label="Lessons" />
        <Item icon={<UserSettings />} label="Profile" bottom />
      </div>
    </Container>
  );
};

export default Menu;
