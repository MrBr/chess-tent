import React from 'react';
import BTooltip from 'react-bootstrap/Tooltip';
import type { TooltipProps } from 'react-bootstrap/Tooltip';
import { css } from '@chess-tent/styled-props';

// Tooltip for some reason injects for a brief moment div in body that doesn't have
// proper css and it causes flickering. This solves the issue

const { className } = css`
  position: absolute;
  top: 0px;
`;

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (props, ref) => (
    <BTooltip
      ref={ref}
      {...props}
      className={`${props.className} ${className}`}
    />
  ),
);
