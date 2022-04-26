import React, { ComponentProps } from 'react';
import styled, { useCss } from '@chess-tent/styled-props';
import { BaseButtonProps, ButtonProps, ToggleButtonProps, UI } from '@types';
import BToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const variants = styled.props.variant.disabled.css<BaseButtonProps>`
  &.danger, &.danger:hover {
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

  &.dark {
    color: var(--light-color);
    background: var(--black-color);
  }

  &.ghost {
    color: var(--dark-color);
    background: transparent;
    border: 1px solid var(--grey-700-color);
  }

  &.text {
    color: var(--dark-color);
    background: transparent;
    border: none;
  }

  &.disabled {
    background: var(--grey-500-color);
  }
`;

const sizes = styled.props.size.stretch.css<BaseButtonProps>`
  ${{ omitProps: ['stretch'] }}

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

  &.extra-small {
    height: 32px;
    border-radius: 6px;
    padding: 0 12px;
  }

  &.stretch {
    width: 100%;
    padding-right: 0;
    padding-left: 0;
  }
`;

export const Button = styled.button.css<ButtonProps>`
  font-weight: 700;
  font-size: 16px;

  a & {
    display: inline-block;
    text-decoration: none;
  }

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

const toggle = styled.props.checked.css<ToggleButtonProps>`
  user-select: none;
  cursor: pointer;

  &.checked {
    ${variants}
  }
  
  :not(.btn-group) &:not(.checked) {
    &.danger {
      border-color: var(--error-color);
    }

    &.primary {
      border-color: var(--primary-color);
    }

    &.secondary {
      border-color: var(--secondary-color);
    }

    &.dark {
      border-color: var(--black-color);
    }
  }

  ${sizes};

  display: inline-flex;
  &, :hover, :focus, :active {
    color: var(--black-color);
    background: transparent;
    border: 1px solid var(--grey-400-color) !important;
    outline: 0;
    box-shadow: none;
  }

  .btn-group > & {
    padding: 11px 16px;
  }
`;

export const ToggleButton = styled<ComponentProps<UI['ToggleButton']>>(
  props => {
    const buttonClassName = useCss(toggle)(props);
    const { size, value, stretch, ...toggleProps } = props;
    return (
      <BToggleButton
        {...toggleProps}
        className={buttonClassName}
        value={value || ''}
      />
    );
  },
).stretch.css`
  &.stretch {
    width: 100%;
  }
`;

ToggleButton.defaultProps = {
  size: 'regular',
  variant: 'primary',
  type: 'checkbox',
};

export { ButtonGroup };
