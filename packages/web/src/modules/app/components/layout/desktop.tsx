import React from 'react';
import { utils } from '@application';
import styled from '@emotion/styled';
import { Components } from '@types';

const { mediaQueryEnhancer } = utils;

export default styled<Components['Layout']>(
  ({ className, children, header, sidebar }) => (
    <div className={className}>
      <div className="layout-header">{header}</div>
      <div className="layout-content">{children}</div>
      <div className="layout-sidebar">{sidebar}</div>
    </div>
  ),
)(
  {
    '.layout-header': {
      gridArea: 'header',
      height: 96,
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
    gridTemplateRows: 'min-content calc(100vh - 96px)',
    gridTemplateColumns: '4fr 1fr',
    gridTemplateAreas: `
    "header header"
    "content sidebar"
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
    gridTemplateColumns: '6fr 2fr',
  }),
  mediaQueryEnhancer('md', {
    gridTemplateColumns: '2fr 1fr',
    '.layout-header': {
      padding: '0 2em',
    },
    '.layout-content': {
      padding: '0 2em',
    },
  }),
);
