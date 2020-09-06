import React from 'react';
import { components } from '@application';
import styled from '@emotion/styled';
import { Components } from '@types';

const { Header, Conversations } = components;

export default styled<Components['Layout']>(({ className, children }) => (
  <div className={className}>
    <div className="layout-header">
      <Header />
    </div>
    <div className="layout-content">{children}</div>
    <div className="layout-sidebar">
      <Conversations />
    </div>
  </div>
))({
  '.layout-header': {
    gridArea: 'header',
    height: 96,
    boxShadow: '0px 1px 0px #ECECEC',
    zIndex: 10,
  },
  '.layout-content': {
    gridArea: 'content',
    background: '#FAFBFB',
  },
  '.layout-sidebar': {
    gridArea: 'sidebar',
    position: 'relative',
  },
  display: 'grid',
  gridTemplateRows: 'min-content auto',
  gridTemplateAreas: `
    "header header"
    "content sidebar"
    `,
  width: '100%',
  height: '100%',
});
