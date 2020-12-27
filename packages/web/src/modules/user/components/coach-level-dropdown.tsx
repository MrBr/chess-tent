import React from 'react';
import { CoachEloRange } from '@chess-tent/models';

import { ui } from '@application';
import { SelectOption, OptionsDropdownProps } from '@types';

const { OptionsDropdown } = ui;

const options: Array<SelectOption<CoachEloRange>> = [
  {
    value: {
      from: 0,
      to: 1200,
      toString: () => 'level1',
    },
    label: '0 < 1200',
  },
  {
    value: {
      from: 1200,
      to: 1600,
      toString: () => 'level2',
    },
    label: '1200 < 1600',
  },
  {
    value: {
      from: 1600,
      to: 2000,
      toString: () => 'level3',
    },
    label: '1600 < 2000',
  },
  {
    value: {
      toString: () => 'level4',
      from: 2000,
      to: 9999,
    },
    label: '2000 < ∞',
  },
  {
    value: undefined,
    label: 'Any',
  },
];

const CoachLevelDropdown: React.FC<Omit<
  OptionsDropdownProps<CoachEloRange>,
  'values' | 'label'
>> = ({ id, className, onChange, initial, size }) => {
  return (
    <OptionsDropdown
      id={id}
      className={className}
      values={options}
      label={'Level:'}
      initial={initial}
      onChange={onChange}
      size={size}
    />
  );
};

export default CoachLevelDropdown;
