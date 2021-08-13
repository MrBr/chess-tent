import React, { useCallback, useEffect, useState } from 'react';
import { hooks, ui, components } from '@application';
import { Components } from '@types';
import { Difficulty, Lesson, Tag } from '@chess-tent/models';
import LessonCard from '../components/lesson-card';
import DifficultyDropdown from './difficulty-dropdown';

const { Container, Headline3, Row, Col, SearchBox } = ui;
const { useTags, useHistory } = hooks;
const { TagsSelect, Filters } = components;

const LessonBrowser: Components['LessonBrowser'] = ({
  lessons,
  onFiltersChange,
  editable,
}) => {
  const history = useHistory();
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

  const handleLessonClick = useCallback(
    (lesson: Lesson) => {
      history.push(`/lesson/${editable ? '' : 'preview/'}${lesson.id}`);
    },
    [editable, history],
  );

  return (
    <Container fluid>
      <Row className="mt-5 mb-4">
        <Col className="text-wrap" md={2} xs={8}>
          <Headline3 className="m-0">Browse lessons</Headline3>
        </Col>
        <Col>
          <Filters>
            {onFiltersChange && (
              <Row className="align-items-center">
                <Col
                  className="d-flex flex-row align-items-center"
                  xs={12}
                  md={3}
                >
                  <DifficultyDropdown
                    id="lessons-difficulty"
                    className="mr-2"
                    onChange={setDifficulty}
                    initial={difficulty}
                    includeNullOption={true}
                    size="small"
                  />
                </Col>
                <Col xs={12} md={5}>
                  <TagsSelect
                    tags={tags}
                    onChange={onSelectedTagsChange}
                    selected={selectedTags}
                  />
                </Col>
                <Col className="d-flex align-items-center" xs={12} md={4}>
                  <SearchBox onSearch={setSearch} debounce={500} />
                </Col>
              </Row>
            )}
          </Filters>
        </Col>
      </Row>
      <Row>
        {lessons?.map(lesson => (
          <Col key={lesson.id} className="col-auto">
            <LessonCard lesson={lesson} onClick={handleLessonClick} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LessonBrowser;
