import React from 'react';
import { components, hooks, ui } from '@application';

const { useActiveUserRecord } = hooks;
const { Header } = components;
const { Container } = ui;

export default () => {
  const [user] = useActiveUserRecord();
  return (
    <Container>
      <Header />
      {JSON.stringify(user)}
    </Container>
  );
};
