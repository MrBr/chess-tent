import React from 'react';
import { ui, hooks, requests, components } from '@application';

const { Container, Button } = ui;
const { useHistory, useApi, useActiveUserRecord } = hooks;
const { Link } = components;

export default () => {
  const history = useHistory();
  const logoutApi = useApi(requests.logout);
  const [user] = useActiveUserRecord();
  return (
    <Container fluid>
      <Link to="/me">{user?.name}</Link>
      <Button onClick={() => history.push('/lesson/new')}>
        Add new lesson
      </Button>
      <Button onClick={() => logoutApi.fetch()}>Logout</Button>
    </Container>
  );
};
