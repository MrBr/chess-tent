import React from 'react';
import { ui } from '@application';
import { Searchable } from '@types';
import { TYPE_LESSON } from '@chess-tent/models';

const { Icon } = ui;

export const LessonsSearchable: Searchable = {
  async getOptions(search) {
    return [
      {
        type: TYPE_LESSON,
        label: search,
        value: search,
        searchable: LessonsSearchable,
      },
    ];
  },

  formatOptionLabel(option) {
    return (
      <span>
        <Icon type="published" />
        {option.value}
      </span>
    );
  },

  onChange(option) {
    console.log(option);
  },

  isSearchableOption(option) {
    return option.type === TYPE_LESSON;
  },
};
