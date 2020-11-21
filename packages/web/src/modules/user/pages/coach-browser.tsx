import React, { useEffect, useState } from 'react';
import { components, hooks, requests, ui } from '@application';
import CoachCard from '../components/coach-card';
import { CoachEloRange, Speciality } from '@chess-tent/models';
import SpecialityDropdown from '../components/speciality-dropdown';
import CoachLevelDropdown from '../components/coach-level-dropdown';

const { useApi } = hooks;
const { Container, Row, Col, SearchBox, Headline3 } = ui;
const { Layout } = components;

export default () => {
  const [filter, setFilter] = useState('');
  const [speciality, setSpeciality] = useState<Speciality | undefined>();
  const [elo, setElo] = useState<CoachEloRange | undefined>();

  const { fetch: fetchCoaches, response } = useApi(requests.users);

  useEffect(() => {
    fetchCoaches({ coach: true, search: filter, speciality, elo });
  }, [fetchCoaches, filter, speciality, elo]);

  return (
    <Layout>
      <Container fluid>
        <Row className="section-header">
          <Col className="d-flex flex-row align-items-center" xs={9}>
            <Headline3 className="m-0 mr-5">Browse coaches</Headline3>
            <SpecialityDropdown
              className="mr-4"
              onChange={setSpeciality}
              includeNullOption={true}
            />
            <CoachLevelDropdown onChange={setElo} includeNullOption={true} />
          </Col>
          <Col className="d-flex align-items-center" xs={3}>
            <SearchBox onSearch={setFilter} debounce={500} />
          </Col>
        </Row>
        <Row>
          {response?.data.map(coach => (
            <Col key={coach.id} className="col-auto">
              <CoachCard coach={coach} />
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
};
