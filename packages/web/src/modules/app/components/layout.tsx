import React from 'react';
import { components } from '@application';
import styled from '@emotion/styled';
import { Components } from '@types';

const { Header, Conversations } = components;

export default styled<Components['Layout']>(
  ({ className, children, onSearch }) => (
    <div className={className}>
      <div className="layout-header">
        <Header onSearch={onSearch} />
      </div>
      <div className="layout-content">{children}</div>
      <div className="layout-sidebar">
        <Conversations />
      </div>
    </div>
  ),
)({
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
    overflowY: 'scroll',
  },
  '.layout-sidebar': {
    gridArea: 'sidebar',
    position: 'relative',
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
});
