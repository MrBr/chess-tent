import React from 'react';
import { Difficulty } from '@chess-tent/models';

import { ui } from '@application';
import { Components, DropdownOption } from '@types';

const { TypedDropdown } = ui;

const options: Array<DropdownOption<Difficulty>> = [
  {
    value: Difficulty.BEGINNER,
    label: 'Beginner',
  },
  {
    value: Difficulty.INTERMEDIATE,
    label: 'Intermediate',
  },
  {
    value: Difficulty.ADVANCED,
    label: 'Advanced',
  },
  {
    value: undefined,
    label: 'Any',
  },
];

const DifficultyDropdown: Components['DifficultyDropdown'] = ({
  className,
  onChange,
  initial,
  includeNullOption,
}) => {
  const values = includeNullOption
    ? options
    : options.filter(it => it.value !== undefined);

  return (
    <TypedDropdown
      className={className}
      values={values}
      label={'Difficulty'}
      initial={initial}
      onChange={onChange}
    />
  );
};

export default DifficultyDropdown;
