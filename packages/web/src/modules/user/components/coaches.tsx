import React, { useEffect, useState, useCallback } from 'react';
import { requests, hooks, ui, components } from '@application';
import { CoachEloRange, Tag } from '@chess-tent/models';
import CoachCard from './coach-card';
import CoachLevelDropdown from './coach-level-dropdown';

const { useApi, useComponentStateSilent, useIsMobile } = hooks;
const { Container, Row, Col, Headline3, SearchBox } = ui;
const { Filters, TagsSelect } = components;

export default () => {
  const { mounted } = useComponentStateSilent();
  const { fetch: fetchCoaches, response } = useApi(requests.users);

  const [filter, setFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [studentElo, setStudentElo] = useState<CoachEloRange | undefined>();
  const isMobile = useIsMobile();

  useEffect(() => {
    !mounted && fetchCoaches({ coach: true });
  }, [mounted, fetchCoaches]);

  useEffect(() => {
    fetchCoaches({
      coach: true,
      search: filter,
      tagIds: selectedTags.map(it => it.id),
      studentElo,
    });
  }, [fetchCoaches, filter, selectedTags, studentElo]);

  const cols = response?.data.map(coach => (
    <Col key={coach.id} className="col-auto">
      <CoachCard coach={coach} />
    </Col>
  ));

  const rows = isMobile ? (
    <Row className="flex-nowrap overflow-auto">{cols}</Row>
  ) : (
    <Row>{cols}</Row>
  );

  const onSelectedTagsChange = useCallback(
    (tagIds: Tag[]) => {
      setSelectedTags(tagIds);
    },
    [setSelectedTags],
  );

  return (
    <Container fluid>
      <Row className="mt-5 mb-4 align-items-center">
        <Col className="col-auto">
          <Headline3 className="m-0 mr-5">Browse coaches</Headline3>
        </Col>
        <Col>
          <Filters>
            <Row className="align-items-center">
              <Col
                className="d-flex flex-row align-items-center"
                xs={12}
                md={3}
              >
                <CoachLevelDropdown
                  id="coach-browser-coach-level"
                  className="mr-2"
                  onChange={setStudentElo}
                  size="small"
                />
              </Col>
              <Col className="d-flex align-items-center" xs={12} md={4}>
                <SearchBox onSearch={setFilter} debounce={500} />
              </Col>
            </Row>
          </Filters>
        </Col>
      </Row>
      {rows}
    </Container>
  );
};
