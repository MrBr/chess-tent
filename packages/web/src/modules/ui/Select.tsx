import React, { ComponentType } from 'react';
import { default as RSelect, components } from 'react-select';
import { default as RSAsync } from 'react-select/async';
import { UI } from '@types';
import styled, { css } from '@chess-tent/styled-props';
import Icon from './Icon';

const selectStyle = css`
  background-color: var(--light-color);

  .select__input {
    width: 100%;
  }
  .select__control {
    border: 1px solid var(--grey-600-color);
    border-radius: 6px;
    box-shadow: none;
    box-sizing: border-box;
    font-weight: 400;
    font-size: 16px;
    outline: 0;
    &:hover,
    &--is-focused {
      border-color: var(--black-color);
    }
  }
  .select__menu {
    z-index: 100;
  }
  .select__indicator-separator {
    display: none;
  }
`;

const Control = ({ children, ...props }: any) => (
  <components.Control {...props}>
    {props.selectProps.icon && (
      <Icon type={props.selectProps.icon} size="small" className="ms-1" />
    )}
    {children}
  </components.Control>
);
const DropdownIndicator = ({ children, ...props }: any) =>
  props.selectProps.hideDropdownIndicator ? null : (
    <components.DropdownIndicator {...props}>
      {props.selectProps.isSearchable ? ' ' : children}
    </components.DropdownIndicator>
  );

const Menu = (props: any) =>
  props.selectProps.hideMenu ? null : <components.Menu {...props} />;

const Select = styled(RSelect)
  .css`${selectStyle}` as unknown as UI['Select'] & {
  defaultProps: {};
};
const AsyncSelect = styled(RSAsync)
  .css`${selectStyle}` as unknown as UI['AsyncSelect'] & { defaultProps: {} };

Select.defaultProps = {
  ...(RSelect as ComponentType).defaultProps,
  classNamePrefix: 'select',
  components: { Control, DropdownIndicator, Menu },
};

AsyncSelect.defaultProps = {
  ...(RSAsync as ComponentType).defaultProps,
  classNamePrefix: 'select',
  components: { Control, DropdownIndicator, Menu },
};

export { Select, AsyncSelect };
