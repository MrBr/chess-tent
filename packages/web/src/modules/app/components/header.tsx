import React from 'react';
import { ui, hooks, requests } from '@application';

const { Container, Button } = ui;
const { useHistory, useApi } = hooks;

export default () => {
  const history = useHistory();
  const logoutApi = useApi(requests.logout);
  return (
    <Container fluid>
      Test
      <Button onClick={() => history.push('/lesson')}>Add new lesson</Button>
      <Button onClick={() => logoutApi.fetch()}>Logout</Button>
    </Container>
  );
};
