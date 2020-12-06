import React, { useCallback, useEffect, useState } from 'react';
import { hooks, ui, components } from '@application';
import { Components } from '@types';
import LessonCard from '../components/lesson-card';
import { Difficulty, Tag } from '@chess-tent/models';
import DifficultyDropdown from './difficulty-dropdown';

const { Container, Headline3, Row, Col, SearchBox } = ui;
const { useTags } = hooks;
const { TagsSelect } = components;

const LessonBrowser: Components['LessonBrowser'] = ({
  lessons,
  onFiltersChange,
}) => {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const tags = useTags();

  useEffect(() => {
    onFiltersChange && onFiltersChange(search, difficulty, selectedTags);
  }, [onFiltersChange, search, difficulty, selectedTags]);

  const onSelectedTagsChange = useCallback(
    (tagIds: Tag['id'][]) => {
      const selected = tags.filter(tag => tagIds.some(id => tag.id === id));
      setSelectedTags(selected);
    },
    [setSelectedTags, tags],
  );

  return (
    <Container fluid>
      <Row className="section-header">
        <Col className="d-flex flex-row align-items-center" xs={9}>
          <Headline3 className="m-0 mr-5">Browse lessons</Headline3>
          {onFiltersChange && (
            <>
              <DifficultyDropdown
                id="lessons-difficulty"
                className="mr-2"
                onChange={setDifficulty}
                initial={difficulty}
                includeNullOption={true}
              />
              <TagsSelect
                tags={tags}
                onChange={onSelectedTagsChange}
                selected={selectedTags}
              />
            </>
          )}
        </Col>
        <Col className="d-flex align-items-center" xs={3}>
          {onFiltersChange && <SearchBox onSearch={setSearch} debounce={500} />}
        </Col>
      </Row>
      <Row>
        {lessons?.map(lesson => (
          <Col key={lesson.id} className="col-auto">
            <LessonCard lesson={lesson} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LessonBrowser;
