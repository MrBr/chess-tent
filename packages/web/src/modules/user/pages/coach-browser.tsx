import React, { useEffect, useState } from 'react';
import { components, hooks, requests, ui } from '@application';
import CoachCard from "../components/coach-card";

const {useApi} = hooks;
const {
  Container,
  Row,
  Col,
} = ui;
const {
  Layout
} = components;

export default () => {
  const [filter, setFilter] = useState("");

  const {fetch: fetchCoaches, response} = useApi(requests.users);

  useEffect(() => {
    fetchCoaches({coach: true, search: filter});
  }, [fetchCoaches, filter]);

  return (
    <Layout onSearch={setFilter}>
      <Container fluid>
        <Row>
          {response?.data.map(coach => (
            <Col key={coach.id} className="col-auto">
              <CoachCard coach={coach}/>
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
};
