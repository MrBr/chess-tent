import React from 'react';
import { Tag } from '@chess-tent/models';
import { TagsSelectProps } from '@types';
import { ui } from '@application';
import { ValueType } from 'react-select';

import { useTags } from '../hooks';

const { Select } = ui;

const TagsSelect = ({ onChange, className, selected }: TagsSelectProps) => {
  const tags = useTags();

  const changeHandle =
    onChange &&
    ((tags: ValueType<Tag>) => onChange(tags ? (tags as Tag[]) : []));

  return (
    <Select
      className={className}
      value={selected}
      options={tags}
      getOptionValue={({ id }) => id}
      getOptionLabel={({ text }) => text}
      onChange={changeHandle}
      placeholder="Select tags"
      isMulti
    />
  );
};

export default TagsSelect;
