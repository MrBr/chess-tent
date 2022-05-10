import React, { ComponentProps } from 'react';
import { Chapter } from '@chess-tent/models';
import { debounce } from 'lodash';
import { ui } from '@application';
import { SingleValue } from 'react-select';
import { Components } from '@types';

const { Select, Text, Input, Dropdown, Icon, Row, Col } = ui;

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
  changeHandle = (value: SingleValue<Chapter>) => {
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
    const { chapters, activeChapter, onRemove, onNew, onEdit, onImport } =
      this.props;
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
            isMulti={false}
          />
        )}
        {(onRemove || onEdit || onNew || onImport) && (
          <Row className="mt-1 g-0 align-items-center justify-content-between">
            {onNew && (
              <Col className="col-auto me-2">
                <Text
                  inline
                  fontSize="extra-small"
                  weight={400}
                  className="me-3 cursor-pointer"
                  onClick={this.newHandle}
                >
                  +Add
                </Text>
              </Col>
            )}
            {onImport && (
              <Col className="col-auto me-2">
                <Text
                  inline
                  fontSize="extra-small"
                  weight={400}
                  className="cursor-pointer"
                  onClick={onImport}
                >
                  Import
                </Text>
              </Col>
            )}
            <Col className="col-auto">
              <Dropdown>
                <Dropdown.Toggle collapse>
                  <Icon type="more" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {onEdit && (
                    <Dropdown.Item
                      onClick={() => this.setState({ editing: !editing })}
                    >
                      <Text
                        inline
                        fontSize="extra-small"
                        className="me-3"
                        weight={400}
                      >
                        Edit
                      </Text>
                    </Dropdown.Item>
                  )}
                  {onRemove && (
                    <Dropdown.Item onClick={() => onRemove(activeChapter)}>
                      <Text inline fontSize="extra-small" weight={400}>
                        Remove
                      </Text>
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        )}
      </>
    );
  }
}
export default ChaptersDropdown;
