import React from 'react';
import { CoachEloRange } from '@chess-tent/models';

import { ui } from '@application';
import { DropdownOption, TypedDropdownProps } from '@types';

const { TypedDropdown } = ui;

const options: Array<DropdownOption<CoachEloRange>> = [
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

const CoachLevelDropdown: React.FC<
  Omit<TypedDropdownProps<CoachEloRange>, 'values' | 'label'> & {
    includeNullOption: boolean;
  }
> = ({ className, onChange, initial, includeNullOption }) => {
  return (
    <TypedDropdown
      className={className}
      values={options}
      label={'Level'}
      initial={initial}
      onChange={onChange}
    />
  );
};

export default CoachLevelDropdown;
