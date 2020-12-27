import React, { useEffect } from 'react';
import { requests, hooks, ui } from '@application';
import CoachCard from './coach-card';

const { useApi, useComponentStateSilent, useIsMobile } = hooks;
const { Container, Row, Col } = ui;

export default () => {
  const { mounted } = useComponentStateSilent();
  const { fetch: fetchCoaches, response } = useApi(requests.users);
  const isMobile = useIsMobile();

  useEffect(() => {
    !mounted && fetchCoaches({ coach: true });
  }, [mounted, fetchCoaches]);

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

  return <Container fluid>{rows}</Container>;
};
