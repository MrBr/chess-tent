import { ComponentProps } from 'react';
import { UI } from '@types';

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

export const sizeEnhancer = (
  props: ComponentProps<UI['Dropdown']['Toggle']>,
) => {
  switch (props.size) {
    case 'extra-small':
      return {
        fontSize: 12,
        padding: '2px 8px 3px 8px',
        lineHeight: '19px',
        borderRadius: 4,
      };
    case 'small':
      return {
        borderRadius: 6,
        fontSize: 14,
        lineHeight: '16px',
        padding: '7px 12px 8px 12px',
      };
    case 'regular':
    default:
      return {
        fontSize: 16,
        borderRadius: 10,
        padding: '15px 16px 14px 16px',
      };
  }
};
