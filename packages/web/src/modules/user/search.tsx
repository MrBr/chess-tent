import React from 'react';
import { ui } from '@application';
import { Searchable } from '@types';
import { TYPE_USER } from '@chess-tent/models';

const { Icon } = ui;

export const CoachSearchable: Searchable = {
  async getOptions(search) {
    return [
      {
        type: TYPE_USER,
        label: search,
        value: search,
        searchable: CoachSearchable,
      },
    ];
  },

  formatOptionLabel(option) {
    return (
      <span>
        <Icon type="profile" />
        {option.value}
      </span>
    );
  },

  onChange(option) {
    console.log(option);
  },

  isSearchableOption(option) {
    return option.type === TYPE_USER;
  },
};
