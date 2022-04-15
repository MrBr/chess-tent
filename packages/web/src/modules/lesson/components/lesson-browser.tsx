import React, { useCallback, useEffect, useState } from 'react';
import { hooks, ui, components } from '@application';
import { Components } from '@types';
import { Difficulty, Lesson, Tag } from '@chess-tent/models';
import LessonCard from '../components/lesson-card';
import DifficultyDropdown from './difficulty-dropdown';
import { isOwned } from '../service';

const { Container, Headline3, Row, Col, SearchBox } = ui;
const {
  useHistory,
  useUserTrainings,
  useActiveUserRecord,
  useComponentStateSilent,
} = hooks;
const { TagsSelect, Filters } = components;

const LessonBrowser: Components['LessonBrowser'] = ({
  lessons,
  onFiltersChange,
  editable,
  title,
}) => {
  const history = useHistory();
  const { mounted } = useComponentStateSilent();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { value: user } = useActiveUserRecord();
  const { value: trainings } = useUserTrainings(user);

  useEffect(() => {
    mounted &&
      onFiltersChange &&
      onFiltersChange(search, difficulty, selectedTags);
    // Filters should trigger change only when changed and not until mounted
    // Leaving "mounted" out of the dependencies
    // eslint-disable-next-line
  }, [onFiltersChange, search, difficulty, selectedTags]);

  const onSelectedTagsChange = useCallback(
    (tagIds: Tag[]) => {
      setSelectedTags(tagIds);
    },
    [setSelectedTags],
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
          <Headline3 className="m-0">{title}</Headline3>
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
                    className="me-2"
                    onChange={setDifficulty}
                    initial={difficulty}
                    includeNullOption={true}
                    size="small"
                  />
                </Col>
                <Col xs={12} md={5}>
                  <TagsSelect
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
        {trainings &&
          lessons?.map(lesson => (
            <Col key={lesson.id} className="col-auto">
              <LessonCard
                lesson={lesson}
                onClick={handleLessonClick}
                owned={isOwned(trainings, lesson.id)}
              />
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default LessonBrowser;
