import React from 'react';
import { css } from '@chess-tent/styled-props';
import { Components } from '@types';

const style = css`
  .layout-menu {
    grid-area: menu;
    width: 70px;
  }

  .layout-header {
    grid-area: header;
    height: 64px;
    z-index: 11;
  }

  .layout-content {
    grid-area: content;
    position: relative;
    overflow-y: auto;
  }

  display: grid;
  grid-template-rows: min-content calc(100vh - 64px);
  grid-template-columns: 0fr 1fr;
  grid-template-areas: 'menu header' 'menu content';
  width: 100%;
  height: 100%;
`;

const LayoutDesktop: Components['Layout'] = ({
  className,
  children,
  header,
  menu,
}) => (
  <div className={`${className} ${style.className}`}>
    <div className="layout-menu">{menu}</div>
    <div className="layout-header">{header}</div>
    <div className="layout-content">{children}</div>
  </div>
);

export default LayoutDesktop;
