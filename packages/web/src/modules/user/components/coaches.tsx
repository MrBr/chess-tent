import React, { useEffect } from 'react';
import { requests, hooks, ui } from '@application';
import CoachCard from "./coach-card";

const { useApi, useComponentStateSilent } = hooks;
const {
  Container,
  Row,
  Col,
} = ui;

export default () => {
  const { mounted } = useComponentStateSilent();
  const { fetch: fetchCoaches, response } = useApi(requests.users);

  useEffect(() => {
    !mounted && fetchCoaches({ coach: true });
  }, [mounted, fetchCoaches]);

  return (
    <Container fluid>
      <Row>
        {response?.data.map(coach => (
          <Col key={coach.id} className="col-auto">
            <CoachCard coach={coach} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
