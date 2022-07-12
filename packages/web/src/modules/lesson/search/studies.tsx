import React from 'react';
import { ui } from '@application';
import { Searchable } from '@types';
import { TYPE_ACTIVITY } from '@chess-tent/models';

const { Icon } = ui;

export const StudiesSearchable: Searchable = {
  async getOptions(search) {
    return [
      {
        type: TYPE_ACTIVITY,
        label: search,
        value: search,
        searchable: StudiesSearchable,
      },
    ];
  },

  formatOptionLabel(option) {
    return (
      <span>
        <Icon type="boardSimple" />
        {option.value}
      </span>
    );
  },

  onChange(option) {
    console.log(option);
  },

  isSearchableOption(option) {
    return option.type === TYPE_ACTIVITY;
  },
};
