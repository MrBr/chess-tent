import React from 'react';
import styled from '@emotion/styled';
import { Components } from '@types';

export default styled<Components['Layout']>(
  ({ className, children, header, menu }) => (
    <div className={className}>
      <div className="layout-menu">{menu}</div>
      <div className="layout-header">{header}</div>
      <div className="layout-content">{children}</div>
    </div>
  ),
)({
  '.layout-menu': {
    gridArea: 'menu',
    width: 70,
  },
  '.layout-header': {
    gridArea: 'header',
    height: 64,
    zIndex: 11,
  },
  '.layout-content': {
    gridArea: 'content',
    position: 'relative',
    overflowY: 'auto',
  },
  display: 'grid',
  gridTemplateRows: 'min-content calc(100vh - 64px)',
  gridTemplateColumns: '0fr 1fr',
  gridTemplateAreas: `
    "menu header"
    "menu content"
    `,
  width: '100%',
  height: '100%',
});
