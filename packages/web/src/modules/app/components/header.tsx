import React from 'react';
import { ui, hooks, requests } from '@application';

const { Container, Button } = ui;
const { useHistory, useApi, useActiveUserRecord } = hooks;

export default () => {
  const history = useHistory();
  const logoutApi = useApi(requests.logout);
  const [user] = useActiveUserRecord();
  return (
    <Container fluid>
      {user?.name}
      <Button onClick={() => history.push('/lesson')}>Add new lesson</Button>
      <Button onClick={() => logoutApi.fetch()}>Logout</Button>
    </Container>
  );
};
