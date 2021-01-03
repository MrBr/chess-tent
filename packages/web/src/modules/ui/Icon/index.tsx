import React, { ComponentProps } from 'react';
import { FunctionComponent } from 'react';
import { UI } from '@types';
import styled from '@emotion/styled';
import * as iconsMap from './iconMap';

type IconProps = ComponentProps<UI['Icon']>;

const sizeEnhancer = (props: IconProps) => {
  if (props.textual) {
    return;
  }
  switch (props.size) {
    case 'large':
      return {
        width: 36,
        height: 36,
      };
    case 'small':
      return {
        width: 16,
        height: 16,
      };
    case 'extra-small':
      return {
        width: 10,
        height: 10,
      };
    case 'regular':
    default:
      return {
        width: 24,
        height: 24,
      };
  }
};

const textualEnhancer = (props: IconProps) =>
  props.textual && {
    '.svg-icon': {
      width: 'auto',
      height: 'auto',
    },
    fontSize: 'inherit',
    color: 'inherit',
    lineHeight: 'inherit',
    verticalAlign: 'sub',
    minWidth: '20px',
    minHeight: '20px',
  };

const Icon = styled<FunctionComponent<IconProps>>(
  ({ type, className, onClick }) => {
    const IconSvgComponent = iconsMap[type];
    return (
      <span className={className} onClick={onClick}>
        <IconSvgComponent className="svg-icon" />
      </span>
    );
  },
)<IconProps>(
  {
    '.svg-icon': {
      width: '100%',
      height: '100%',
    },
    color: '#BABDC2',
    display: 'inline-block',
  },
  sizeEnhancer,
  textualEnhancer,
);

export default Icon;
