import React from 'react';
import { components, ui } from '@application';
import Coaches from '../components/coaches';

const { Container } = ui;
const { Page } = components;

export default () => {
  return (
    <Page>
      <Container fluid>
        <Coaches />
      </Container>
    </Page>
  );
};
