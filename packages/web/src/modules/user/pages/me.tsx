import React from 'react';
import { components, hooks, ui } from '@application';
import { User } from '@chess-tent/models';

const { useActiveUserRecord } = hooks;
const { Header, Lessons, Activities } = components;
const { Container } = ui;

export default () => {
  const [user] = useActiveUserRecord() as [User, never, never];
  return (
    <Container>
      <Header />
      {JSON.stringify(user)}
      <Lessons owner={user} />
      <Activities owner={user} />
    </Container>
  );
};
