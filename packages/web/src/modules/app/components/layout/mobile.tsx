import React from 'react';
import { css } from '@chess-tent/styled-props';
import { Components } from '@types';

const style = css`
  .layout-header {
    height: 54px;
    box-shadow: 0 1px 0 #ececec;
    z-index: 11;
  }
  .layout-content {
    background: #fafbfb;
    position: relative;
    overflow-y: scroll;
    flex: 1;
  }
  .layout-footer {
    position: relative;
    height: 64px;
    &:empty {
      display: none;
    }
  }
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const LayoutMobile: Components['Layout'] = ({
  className,
  children,
  footer,
  header,
}) => (
  <div className={`${className} ${style.className}`}>
    <div className="layout-header">{header}</div>
    <div className="layout-content">{children}</div>
    <div className="layout-footer">{footer}</div>
  </div>
);

export default LayoutMobile;
