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
