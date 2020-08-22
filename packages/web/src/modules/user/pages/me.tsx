import React, { useEffect } from 'react';
import { components, hooks, requests, ui } from '@application';

const { useApi } = hooks;
const { Header } = components;
const { Container } = ui;

export default () => {
  const { fetch, loading, response } = useApi(requests.me);
  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <Container>
      <Header />
      {loading ? 'Loading' : JSON.stringify(response)}
    </Container>
  );
};
