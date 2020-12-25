import React from 'react';
import { Difficulty } from '@chess-tent/models';

import { ui } from '@application';
import { Components, SelectOption } from '@types';

const { OptionsDropdown } = ui;

const options: Array<SelectOption<Difficulty>> = [
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
  id,
  className,
  onChange,
  initial,
  includeNullOption,
  size,
}) => {
  const values = includeNullOption
    ? options
    : options.filter(it => it.value !== undefined);

  return (
    <OptionsDropdown
      id={id}
      size={size}
      className={className}
      values={values}
      label={'Difficulty:'}
      initial={initial}
      onChange={onChange}
    />
  );
};

export default DifficultyDropdown;
