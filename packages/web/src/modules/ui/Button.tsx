import React, { ComponentProps } from 'react';
import styled, { useCss } from '@chess-tent/styled-props';
import { ButtonProps, UI } from '@types';

const variants = styled.props.variant.disabled.css<
  Pick<ButtonProps, 'variant' | 'disabled'>
>`
  &.danger {
    color: var(--light-color);
    background: var(--error-color);
  }

  &.primary {
    color: var(--light-color);
    background: var(--primary-gradient);
  }

  &.secondary {
    color: var(--light-color);
    background: var(--secondary-color);
  }

  &.ghost {
    color: var(--dark-color);
    background: transparent;
    border: 1px solid var(--grey-700-color);
  }

  &.disabled {
    background: var(--grey-500-color);
  }
`;

const sizes = styled.props.size.css<Pick<ButtonProps, 'size'>>`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  
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

export const Button = styled.button.css<ButtonProps>`
  font-weight: 700;
  font-size: 16px;

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

const toggle = styled.props.checked.css<ButtonProps>`
  display: inline-block;
  user-select: none;
  cursor: pointer;

  &.checked {
    ${variants}
  }
  
  ${sizes}
`;

export const ToggleButton = styled<ComponentProps<UI['ToggleButton']>>(
  props => {
    const { className, children, defaultChecked, onChange, checked } = props;
    const buttonClassName = useCss(toggle)(props);
    return (
      <label className={className}>
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          onChange={onChange}
          checked={checked}
        />
        <span className={buttonClassName}>{children}</span>
      </label>
    );
  },
).css`
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

ToggleButton.defaultProps = {
  size: 'regular',
  variant: 'primary',
};
