import React, { useCallback, useEffect, useState } from 'react';
import { hooks, requests, ui } from '@application';
import { Components } from '@types';
import LessonCard from '../components/lesson-card';
import { Difficulty, Tag } from '@chess-tent/models';
import DifficultyDropdown from './difficulty-dropdown';
import TagsSelect from '../../tag/components/tags-select';

const { Container, Headline3, Row, Col, SearchBox } = ui;
const { useUserLessonsRecord, useApi, useTags } = hooks;

const LessonBrowser: Components['LessonBrowser'] = ({ user }) => {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const { fetch: fetchLessons, response } = useApi(requests.lessons);
  const [lessons, saveLessons] = useUserLessonsRecord(user);
  const tags = useTags();

  useEffect(() => {
    fetchLessons({
      owner: user.id,
      search,
      tagIds: selectedTags.map(it => it.id),
      difficulty,
    });
  }, [fetchLessons, search, difficulty, selectedTags, user.id]);

  useEffect(() => {
    if (response) {
      saveLessons(response.data);
    }
  }, [saveLessons, response]);

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
        </Col>
        <Col className="d-flex align-items-center" xs={3}>
          <SearchBox onSearch={setSearch} debounce={500} />
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
