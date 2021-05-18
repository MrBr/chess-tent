import _ from 'lodash';
import React, { ComponentProps, useCallback, useState } from 'react';
import { default as BDropdown } from 'react-bootstrap/Dropdown';
import styled from '@emotion/styled';
import { SelectOption, UI } from '@types';
import { Headline6, Text } from './Text';
import { sizeEnhancer } from './enhancers';

const Toggle = styled.div(
  {
    width: '100%',
    background: '#F3F4F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sizeEnhancer,
  ({ collapse }: ComponentProps<UI['Dropdown']['Toggle']>) =>
    collapse && {
      ':after': { display: 'none' },
      background: 'transparent',
      paddingLeft: 0,
      paddingRight: 0,
    },
);

// @ts-ignore
BDropdown.Menu = styled(BDropdown.Menu)(({ width }) => ({
  width: width || '100%',
}));

// @ts-ignore
BDropdown.Item = styled(BDropdown.Item)({
  whiteSpace: 'initial',
});

// @ts-ignore
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
        <Text className="m-0 mr-1">{label}</Text>
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

export default Dropdown;
