import React, { ComponentProps } from 'react';
import { UI } from '@types';
import styled, { hoistClassName } from '@chess-tent/styled-props';
import * as iconsMap from './iconMap';

type IconProps = ComponentProps<UI['Icon']>;

const Icon = styled<IconProps>(
  ({ type, className, onClick, innerRef, textual, ...props }) => {
    const IconSvgComponent = iconsMap[type];
    return (
      <span className={className} onClick={onClick} ref={innerRef} {...props}>
        <IconSvgComponent className="svg-icon" />
      </span>
    );
  },
).size.textual.variant.background.css<IconProps>`
  ${{ omitProps: ['background'] }}

  display: inline-block;
  box-sizing: content-box;
  position: relative;
  vertical-align: top;
  padding: 4px;

  .svg-icon {
    vertical-align: top;
    width: 100%;
    height: 100%;
  }
  
  &.background {
    padding: 12px;
    border-radius: 12px;
  }
  
  &.primary {
      color: var(--primary-color);
    &.background {
      color: var(--light-color);
      background: var(--primary-color);
    }
  }
  
  &.secondary {
      color: var(--secondary-color);
    &.background {
      color: var(--light-color);
      background: var(--secondary-color);
    }
  }
  
  &.tertiary {
      color: var(--tertiary-color);
    &.background {
      color: var(--light-color);
      background: var(--tertiary-color);
    }
  }
  
  &.grey-700 {
    color: var(--grey-700-color);
  }
  
  &.light {
    color: var(--light-color);
  }
  
  &.large {
    width: 36px;
    height: 36px;
  }

  &.small {
    width: 20px;
    height: 20px;
    padding: 3px;
  }

  &.extra-small {
    width: 18px;
    height: 18px;
    padding: 2px;
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
    padding: 0;
  }
`;

const IconWithRef = React.forwardRef<HTMLElement, IconProps>((props, ref) => (
  <Icon {...props} innerRef={ref} />
));

IconWithRef.defaultProps = {
  variant: 'grey-700',
  size: 'regular',
};

hoistClassName(Icon, IconWithRef);

export default IconWithRef;
