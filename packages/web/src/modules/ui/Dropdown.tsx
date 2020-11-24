import React, { ComponentProps, useCallback, useState } from 'react';
import { default as BDropdown } from 'react-bootstrap/Dropdown';
import styled from '@emotion/styled';
import { SelectOption, UI } from '@types';
import _ from 'lodash';
import { Headline6, Text } from './Text';

const sizeEnhancer = (props: ComponentProps<UI['Dropdown']['Toggle']>) => {
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
    default:
      return {
        fontSize: 16,
        borderRadius: 10,
        padding: '15px 16px 14px 16px',
      };
  }
};

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
BDropdown.Toggle.defaultProps = {
  as: Toggle,
};

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
    <BDropdown className={className} onSelect={onSelect}>
      <BDropdown.Toggle id={id}>
        <Text className="m-0 mr-1">{label}</Text>
        <Headline6 className="m-0 ml-1 mr-1">{selectedOption.label}</Headline6>
      </BDropdown.Toggle>
      <BDropdown.Menu>
        {values.map(option => (
          <BDropdown.Item eventKey={option.value} key={option.label}>
            {option.label}
          </BDropdown.Item>
        ))}
      </BDropdown.Menu>
    </BDropdown>
  );
};

export default BDropdown as UI['Dropdown'];
