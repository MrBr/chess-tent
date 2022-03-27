import React from 'react';
import { utils } from '@application';
import styled from '@emotion/styled';
import { Components } from '@types';

const { mediaQueryEnhancer } = utils;

export default styled<Components['Layout']>(
  ({ className, children, header }) => (
    <div className={className}>
      <div className="layout-menu"></div>
      <div className="layout-header">{header}</div>
      <div className="layout-content">{children}</div>
    </div>
  ),
)(
  {
    '.layout-menu': {
      gridArea: 'menu',
      width: 70,
    },
    '.layout-header': {
      gridArea: 'header',
      height: 64,
      boxShadow: '0px 1px 0px #ECECEC',
      zIndex: 10,
      padding: '0 5em',
    },
    '.layout-content': {
      gridArea: 'content',
      padding: '0 5em',
      background: '#FAFBFB',
      position: 'relative',
      overflowY: 'auto',
    },
    '.layout-sidebar': {
      gridArea: 'sidebar',
      position: 'relative',
    },
    '&.extended-sidebar': {
      gridTemplateColumns: '4fr 2fr',
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
  },
  mediaQueryEnhancer('lg', {
    '.layout-header': {
      padding: '0 2em',
    },
    '.layout-content': {
      padding: '0 2em',
    },
  }),
  mediaQueryEnhancer('md', {
    '.layout-header': {
      padding: '0 2em',
    },
    '.layout-content': {
      padding: '0 2em',
    },
  }),
);
