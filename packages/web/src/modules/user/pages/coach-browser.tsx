import React from 'react';
import { components, ui } from '@application';
import Coaches from '../components/coaches';

const { Headline4, Text } = ui;
const { Page } = components;

const PageCoachBrowser = () => {
  return (
    <Page>
      <Page.Body>
        <Headline4 className="m-0 mt-4">Coaches 🎓</Headline4>
        <Text className="mb-5">
          Find the right coach for you to start learning.
        </Text>
        <Coaches />
      </Page.Body>
    </Page>
  );
};

export default PageCoachBrowser;
