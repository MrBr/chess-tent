import React from 'react';
import { components } from '@application';
import TabBar from '../tabBar';
import styled from '@emotion/styled';
import { Components } from '@types';

const { Header } = components;

export default styled<Components['Layout']>(({ className, children }) => (
  <div className={className}>
    <div className="layout-header">
      <Header />
    </div>
    <div className="layout-content">{children}</div>
    <div className="layout-footer">
      <TabBar />
    </div>
  </div>
))({
  '.layout-header': {
    gridArea: 'header',
    height: 54,
    boxShadow: '0px 1px 0px #ECECEC',
    zIndex: 10,
    padding: '0 5em',
  },
  '.layout-content': {
    gridArea: 'content',
    padding: '0 5em',
    background: '#FAFBFB',
    position: 'relative',
    overflowY: 'scroll',
  },
  '.layout-footer': {
    gridArea: 'footer',
    position: 'relative',
  },
  display: 'grid',
  gridTemplateRows: 'min-content calc(100vh - 54px - 64px) 64px',
  gridTemplateAreas: `
    "header"
    "content"
    "footer"
    `,
  width: '100%',
  height: '100%',
});
