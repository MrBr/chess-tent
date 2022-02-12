import React, { ComponentProps } from 'react';
import { UI } from '@types';
import styled, { css } from '@chess-tent/styled-props';
import * as iconsMap from './iconMap';

type IconProps = ComponentProps<UI['Icon']>;

const Icon = styled<IconProps>(({ type, className, onClick }) => {
  const IconSvgComponent = iconsMap[type];
  return (
    <span className={className} onClick={onClick}>
      <IconSvgComponent className="svg-icon" />
    </span>
  );
}).size.textual.color.css`
  display: inline-block;
  
  .svg-icon {
    width: 100%;
    height: 100%;
  }

  ${({ color }) =>
    css`
      color: var(--${color}-color);
    `}

  &.large {
    width: 36px;
    height: 36px;
  }

  &.small {
    width: 16px;
    height: 16px;
  }

  &.extra-small {
    width: 10px;
    height: 10px;
  }

  &.regular {
    width: 24px;
    height: 24px;
  }

  &.textual {
    .svg-icon {
      width: auto;
      height: auto;
    }

    font-size: inherit;
    color: inherit;
    line-height: inherit;
    vertical-align: sub;
    min-width: 20px;
    min-height: 20px;
  }
`;

Icon.defaultProps = {
  color: 'grey-700',
  size: 'regular',
};

export default Icon;
