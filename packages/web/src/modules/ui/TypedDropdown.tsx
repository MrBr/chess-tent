import _ from 'lodash';
import { DropdownOption, UI } from '@types';
import React, { useCallback, useState } from 'react';
import Dropdown from './Dropdown';
import { Text, Headline6 } from './Text';

const pickInitialOption = (
  options: DropdownOption<any>[],
  initial?: any,
): DropdownOption<any> => {
  if (!_.isNull(initial) && !_.isEmpty(options)) {
    return options.find(it => it.value === initial) || { label: '' };
  }

  if (!_.isEmpty(options)) {
    return options[0];
  }

  return { label: '' };
};

const TypedDropdown: UI['TypedDropdown'] = ({
  className,
  label,
  values,
  initial,
  onChange,
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
      <Dropdown.Toggle id="difficulty-dropdown" size="small">
        <Text className="m-0">{label}: </Text>
        <Headline6 className="m-0 ml-1 mr-1">{selectedOption.label}</Headline6>
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

export default TypedDropdown;
