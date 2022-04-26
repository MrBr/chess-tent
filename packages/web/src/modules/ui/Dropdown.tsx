import _ from 'lodash';
import React, { ComponentProps, useCallback, useState } from 'react';
import { default as BDropdown } from 'react-bootstrap/Dropdown';
import styled, { useCss } from '@chess-tent/styled-props';
import { SelectOption, UI } from '@types';
import { Headline6, Text } from './Text';
import { inputSizePropStyle } from './enhancers';

const toggleStyle = styled.props.size.collapse.css<
  ComponentProps<UI['Dropdown']['Toggle']>
>`
  &.collapse {
    &:after {
      display: none
    }

    background: transparent;
    padding-left: 0 !important;
    padding-right: 0 !important;
    display: flex;
    border: none;
  }

  width: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--grey-600-color);
  border-radius: 5px;
  ${inputSizePropStyle}
`;

const Toggle = React.forwardRef<
  HTMLDivElement,
  ComponentProps<UI['Dropdown']['Toggle']>
>((props, ref) => {
  const className = useCss(toggleStyle)(props);
  return (
    <div {...props} className={`dropdown-toggle ${className}`} ref={ref} />
  );
});

Toggle.defaultProps = {
  size: 'small',
};

BDropdown.Toggle.defaultProps = {
  as: Toggle,
};

const Dropdown: UI['Dropdown'] = BDropdown as UI['Dropdown'];

const pickInitialOption = (
  options: SelectOption<any>[],
  initial?: any,
): SelectOption<any> => {
  if (!_.isNull(initial) && !_.isEmpty(options)) {
    return options.find(it => it.value === initial) || { label: '' };
  }

  if (!_.isEmpty(options)) {
    return options[0];
  }

  return { label: '' };
};

export const OptionsDropdown: UI['OptionsDropdown'] = ({
  id,
  className,
  label,
  values,
  initial,
  onChange,
  size,
}) => {
  const [selectedOption, setSelectedOption] = useState(
    pickInitialOption(values, initial),
  );

  const onSelect = useCallback(
    value => {
      if (_.isUndefined(onChange)) {
        return;
      }

      let selected;
      if (_.isNull(value)) {
        selected = values.find(it => it.value === undefined);
      } else {
        selected = values.find(it => it.value?.toString() === value);
      }

      if (selected !== undefined) {
        onChange(selected.value);
        setSelectedOption(selected);
      } else {
        onChange(null);
        setSelectedOption({ label: '' });
      }
    },
    [onChange, values],
  );

  return (
    <Dropdown className={className} onSelect={onSelect}>
      <Dropdown.Toggle id={id} size={size}>
        <Text className="m-0 me-1">{label}</Text>
        <Headline6 className="m-0 ms-1 me-1">{selectedOption.label}</Headline6>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {values.map(option => (
          <Dropdown.Item eventKey={option.value} key={option.label}>
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Dropdown;
