import React from 'react';
import { components, ui } from '@application';
import Coaches from '../components/coaches';

const { Container, Headline4, Text } = ui;
const { Page } = components;

const PageCoachBrowser = () => {
  return (
    <Page>
      <Container fluid className="ps-5 pe-5">
        <Headline4 className="m-0 mt-4">Coaches 🎓</Headline4>
        <Text className="mb-5">
          Find the right coach for yourself and start learning.
        </Text>
        <Coaches />
      </Container>
    </Page>
  );
};

export default PageCoachBrowser;
