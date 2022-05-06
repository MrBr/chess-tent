import React from 'react';
import { components, ui } from '@application';
import { Components } from '@types';
import { css } from '@chess-tent/styled-props';
import Item, { ItemLabel } from './item';

const { Container } = ui;
const { UserSettings } = components;

const style = css`
  height: 100%;
  position: relative;
  overflow-y: clip;

  &:hover > div {
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
  const className = ` ${style.className} g-0`;

  return (
    <Container className={className}>
      <div>
        <Item icon="logo" label="ChessTent" break />
        <Item icon="dashboard" path="/" label="Dashboard" />
        <Item icon="lightbulb" path="/lessons" label="Lessons" />
        <Item icon="board" path="/studies" label="Studies" />
        <Item icon="contacts" path="/coaches" label="Coaches" />
        <Item icon="template" path="/templates" label="Templates" />
        <Item bottom>
          <UserSettings label={<ItemLabel>Profile</ItemLabel>} />
        </Item>
      </div>
    </Container>
  );
};

export default Menu;
