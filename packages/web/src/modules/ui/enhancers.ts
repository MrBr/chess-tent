import { ComponentProps } from 'react';
import { UI, Utils } from '@types';
import styled, { css } from '@chess-tent/styled-props';

export const inputSizePropStyle = styled.props.size.css`
  &.extra-small {
    font-size: 14px;
    border-radius: 4px;
    padding: 5px 6px;
    line-height: 20px;
  }

  &.small {
    font-size: 16px;
    border-radius: 6px;
    padding: 8px 12px;
    line-height: 24px;
  }

  &.medium {
    border-radius: 6px;
    font-size: 18px;
    line-height: 26px;
    padding: 12px 16px;
  }
`;

export interface BorderRadiusProps {
  borderRadius: 'large' | 'regular' | 'small' | 'extra-small';
}

export const getBorderRadiusSize = (
  sizeName?: BorderRadiusProps['borderRadius'],
) => {
  switch (sizeName) {
    case 'extra-small':
      return 4;
    case 'small':
      return 6;
    case 'large':
      return 16;
    case 'regular':
    default:
      return 10;
  }
};

export const borderRadiusEnhancer = (props: BorderRadiusProps) => ({
  borderRadius: getBorderRadiusSize(props.borderRadius),
});

const extraSmall = {
  fontSize: 12,
  padding: '2px 8px 3px 8px',
  lineHeight: '19px',
  borderRadius: 4,
};

const small = {
  borderRadius: 6,
  fontSize: 14,
  lineHeight: '16px',
  padding: '7px 12px 8px 12px',
};

const regular = {
  fontSize: 16,
  borderRadius: 10,
  padding: '15px 16px 14px 16px',
};

export const sizeEnhancer = (
  props: ComponentProps<UI['Dropdown']['Toggle']>,
) => {
  switch (props.size) {
    case 'extra-small':
      return extraSmall;
    case 'small':
      return small;
    case 'regular':
    default:
      return regular;
  }
};

export const mobileCss: Utils['mobileCss'] = (
  style: TemplateStringsArray,
  ...args: any[]
) => {
  return `
    @media screen and (max-width: 768px) {
      ${css(style, ...args).staticStyle}
    }
  `;
};
