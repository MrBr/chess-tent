import React, { useEffect, useState } from 'react';
import { requests, hooks, ui, components } from '@application';
import { CoachEloRange } from '@chess-tent/models';
import CoachCard from './coach-card';
import CoachLevelDropdown from './coach-level-dropdown';

const { useApi } = hooks;
const { Row, Col } = ui;
const { Filters } = components;

const Coaches = () => {
  const { fetch: fetchCoaches, response } = useApi(requests.coaches);

  const [studentElo, setStudentElo] = useState<CoachEloRange | undefined>();

  useEffect(() => {
    fetchCoaches({ coach: true, studentElo });
  }, [fetchCoaches, studentElo]);

  const cols = response?.data.map(coach => (
    <Col key={coach.id} className="col-auto mb-4">
      <CoachCard coach={coach} />
    </Col>
  ));

  return (
    <>
      <Row className="mt-5 mb-4 align-items-center">
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
                  className="me-2"
                  onChange={setStudentElo}
                  size="small"
                />
              </Col>
            </Row>
          </Filters>
        </Col>
      </Row>
      <Row>{cols}</Row>
    </>
  );
};

export default Coaches;
