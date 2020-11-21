import React from 'react';
import { Speciality } from '@chess-tent/models';

import { ui } from '@application';
import { DropdownOption, TypedDropdownProps } from '@types';

const { TypedDropdown } = ui;

const options: Array<DropdownOption<Speciality>> = [
  {
    value: Speciality.OPENING,
    label: 'Opening',
  },
  {
    value: Speciality.MIDGAME,
    label: 'Midgame',
  },
  {
    value: Speciality.ENDGAME,
    label: 'Endgame',
  },
  {
    value: undefined,
    label: 'Any',
  },
];

const SpecialityDropdown: React.FC<
  Omit<TypedDropdownProps<Speciality>, 'values' | 'label'> & {
    includeNullOption: boolean;
  }
> = ({ className, onChange, initial, includeNullOption }) => {
  const values = includeNullOption
    ? options
    : options.filter(it => it.value !== undefined);

  return (
    <TypedDropdown
      className={className}
      values={values}
      label={'Speciality'}
      initial={initial}
      onChange={onChange}
    />
  );
};

export default SpecialityDropdown;
