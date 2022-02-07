import styled from '@chess-tent/styled-props';
import { ButtonProps } from '@types';

const variants = styled.props.variant.disabled.css<
  Pick<ButtonProps, 'variant' | 'disabled'>
>`
  &.danger {
    color: var(--light-color);
    background: var(--error-color);
  }

  &.primary {
    color: var(--light-color);
    background: var(--primary-color);
  }

  &.secondary {
    color: var(--light-color);
    background: var(--secondary-color);
  }

  &.ghost {
    color: var(--dark-color);
    background: transparent;
  }
  
  &.disabled {
    background: var(--grey-500);
  }
`;

const sizes = styled.props.size.css<Pick<ButtonProps, 'size'>>`
  &.large {
    height: 64px;
    border-radius: 10px;
    padding: 0 60px;
  }

  &.regular {
    height: 50px;
    border-radius: 8px;
    padding: 0 60px;
  }

  &.small {
    height: 42px;
    border-radius: 6px;
    padding: 0 30px;
  }
`;

const Button = styled.button.css<ButtonProps>`
  font-weight: 700;
  border: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: none;
  }
  
  
  ${sizes}
  ${variants}
`;

Button.defaultProps = {
  size: 'large',
  variant: 'primary',
};

export default Button;
