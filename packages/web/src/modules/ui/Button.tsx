import styled from '@emotion/styled';
import { ButtonProps } from '@types';
import { BorderRadiusProps, getBorderRadiusSize } from './enhancers';

const buttonPadding = (size: ButtonProps['size']) => {
  switch (size) {
    case 'extra-small':
      return '4px 8px 5px';
    case 'small':
      return '7px 16px 8px';
    case 'large':
      return '29px 48px 30px';
    default:
      return '15px 24px 14px';
  }
};

const buttonBackground = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'danger':
      return 'linear-gradient(90deg, #F46F24 0%, #F44D24 100%)';
    case 'secondary':
      return 'linear-gradient(90deg, #F46F24 0%, #F44D24 100%)';
    case 'regular':
      return '#E8E9EB';
    default:
      return 'linear-gradient(90deg, #5AD9AB 0%, #26D95C 100%)';
  }
};
const buttonTextColor = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'danger':
      return '#FFFFFF';
    case 'secondary':
      return '#FFFFFF';
    case 'regular':
      return '#2F3849';
    default:
      return '#FFFFFF';
  }
};

const buttonVariantEnhancer = (props: ButtonProps) => ({
  background: buttonBackground(props.variant),
  color: buttonTextColor(props.variant),
});

const buttonSizeEnhancer = (props: ButtonProps) => ({
  padding: buttonPadding(props.size),
  borderRadius: getBorderRadiusSize(
    props.size as BorderRadiusProps['borderRadius'],
  ),
});

export const Button = styled.button<ButtonProps>(
  {
    '&:focus': {
      outline: 'none',
    },
    border: 'none',
  },
  buttonSizeEnhancer,
  buttonVariantEnhancer,
);

Button.defaultProps = {
  size: 'regular',
};
