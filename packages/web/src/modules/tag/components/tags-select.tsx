import React from 'react';
import { Tag } from '@chess-tent/models';
import { TagsSelectProps } from '@types';

import { ui } from '@application';
import { ValueType } from 'react-select';

const { Select } = ui;

class TagsSelect extends React.Component<
  TagsSelectProps,
  { editing: boolean }
> {
  onChange = (tags: ValueType<Tag>) => {
    const { onChange } = this.props;
    onChange && onChange(tags ? (tags as Tag[]).map(({ id }) => id) : []);
  };

  render() {
    const { className, tags, selected } = this.props;
    return (
      <Select
        className={className}
        value={selected}
        options={tags}
        getOptionValue={({ id }) => id}
        getOptionLabel={({ text }) => text}
        onChange={this.onChange}
        placeholder="Select tags"
        isMulti
      />
    );
  }
}

export default TagsSelect;
