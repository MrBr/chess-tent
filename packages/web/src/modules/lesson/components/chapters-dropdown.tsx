import React, { useCallback, useState } from 'react';
import { Chapter } from '@chess-tent/models';
import { debounce } from 'lodash';

import { ui } from '@application';
import { ValueType } from 'react-select';

const { Select, Text, Input } = ui;

const ChaptersDropdown = ({
  chapters,
  activeChapter,
  onChange,
  onEdit,
  onNew,
}: {
  chapters: Chapter[];
  activeChapter: Chapter;
  onChange?: (chapter: Chapter) => void;
  onEdit?: (title: string) => void;
  onNew?: () => void;
}) => {
  const [editing, setEditing] = useState(false);
  const debouncedEdit = useCallback(
    debounce((value: string) => {
      onEdit && onEdit(value);
    }, 500),
    [],
  );
  const editHandle = useCallback(
    event => {
      if (event.key === 'Enter') {
        setEditing(false);
        return;
      }
      debouncedEdit(event.target.value);
    },
    [debouncedEdit],
  );
  const addNew = useCallback(() => {
    if (!onNew) {
      return;
    }
    setEditing(true);
    onNew();
  }, [onNew]);
  const changeHandle = useCallback(
    (value: ValueType<Chapter>) => {
      if (!onChange || !value) {
        return;
      }
      onChange(value as Chapter);
    },
    [onChange],
  );

  return (
    <>
      {editing ? (
        <Input
          autoFocus
          defaultValue={activeChapter.state.title}
          onBlur={() => setEditing(false)}
          onKeyPress={editHandle}
        />
      ) : (
        <Select
          value={activeChapter}
          options={chapters}
          getOptionLabel={chapter => chapter.state.title}
          getOptionValue={chapter => chapter.id}
          isSearchable={false}
          onChange={changeHandle}
        />
      )}
      <Text
        inline
        fontSize="extra-small"
        weight={700}
        className="mr-2 cursor-pointer"
        onClick={addNew}
      >
        Add chapter
      </Text>
      <Text
        inline
        fontSize="extra-small"
        weight={700}
        onClick={() => setEditing(!editing)}
      >
        Edit chapter
      </Text>
    </>
  );
};

export default ChaptersDropdown;
