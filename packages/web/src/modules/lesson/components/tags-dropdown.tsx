import React from 'react';
import { Tag } from '@chess-tent/models';

import { ui } from '@application';
import { ValueType } from 'react-select';

const { Select } = ui;
interface DifficultyDropdownProps {
  tags: Tag[];
  selected?: Tag[];
  onChange?: (tags: Tag['id'][]) => void;
}

class DifficultyDropdown extends React.Component<
  DifficultyDropdownProps,
  { editing: boolean }
> {
  onChange = (tags: ValueType<Tag>) => {
    const { onChange } = this.props;
    onChange && onChange(tags ? (tags as Tag[]).map(({ id }) => id) : []);
  };

  render() {
    const { tags, selected } = this.props;
    return (
      <Select
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
export default DifficultyDropdown;
