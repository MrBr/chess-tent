import React from 'react';
import { components, hooks, ui } from '@application';
import { User } from '@chess-tent/models';

const { useActiveUser } = hooks;
const { Header } = components;
const { Container } = ui;

export default () => {
  const user = useActiveUser() as User;
  return (
    <Container>
      <Header />
      {JSON.stringify(user)}
    </Container>
  );
};
