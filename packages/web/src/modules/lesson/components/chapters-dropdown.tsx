import React, { ComponentProps } from 'react';
import { Chapter } from '@chess-tent/models';
import { debounce } from 'lodash';
import { ui } from '@application';
import { ValueType } from 'react-select';
import { Components } from '@types';

const { Select, Text, Input } = ui;

class ChaptersDropdown extends React.Component<
  ComponentProps<Components['LessonChapters']>,
  { editing: boolean }
> {
  state = { editing: false };

  doneEditing = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const { onEdit } = this.props;
    this.setState({ editing: false });
    this.debouncedEdit.cancel();
    onEdit && onEdit((event.target as HTMLInputElement).value);
  };
  debouncedEdit = debounce(
    (value: string) => {
      const { onEdit } = this.props;
      onEdit && onEdit(value);
    },
    500,
    { trailing: true },
  );
  editHandle = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.doneEditing(event);
      return;
    }
    this.debouncedEdit((event.target as HTMLInputElement).value);
  };
  changeHandle = (value: ValueType<Chapter, boolean>) => {
    const { onChange } = this.props;
    if (!onChange || !value) {
      return;
    }
    onChange(value as Chapter);
  };
  newHandle = () => {
    const { onNew } = this.props;
    if (!onNew) {
      return;
    }
    this.setState({ editing: true });
    onNew();
  };
  render() {
    const { editing } = this.state;
    const { chapters, activeChapter, onRemove, editable } = this.props;
    return (
      <>
        {editing ? (
          <Input
            autoFocus
            defaultValue={activeChapter.state.title}
            onBlur={this.doneEditing}
            onKeyUp={this.editHandle}
          />
        ) : (
          <Select
            value={activeChapter}
            options={chapters}
            hideSelectedOptions={false}
            getOptionLabel={chapter => chapter.state.title}
            getOptionValue={chapter => chapter.id}
            isSearchable={false}
            onChange={this.changeHandle}
          />
        )}
        {editable && (
          <>
            <Text
              inline
              fontSize="extra-small"
              weight={700}
              className="mr-3 cursor-pointer"
              onClick={this.newHandle}
            >
              Add
            </Text>
            <Text
              inline
              fontSize="extra-small"
              className="mr-3"
              weight={700}
              onClick={() => this.setState({ editing: !editing })}
            >
              Edit
            </Text>
            <Text
              inline
              fontSize="extra-small"
              weight={700}
              onClick={() => onRemove && onRemove(activeChapter)}
            >
              Remove
            </Text>
          </>
        )}
      </>
    );
  }
}
export default ChaptersDropdown;
