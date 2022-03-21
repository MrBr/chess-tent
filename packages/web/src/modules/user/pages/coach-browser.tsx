import React from 'react';
import { components, ui } from '@application';
import Coaches from '../components/coaches';

const { Container } = ui;
const { Page } = components;

const PageCoachBrowser = () => {
  return (
    <Page>
      <Container fluid>
        <Coaches />
      </Container>
    </Page>
  );
};

export default PageCoachBrowser;
