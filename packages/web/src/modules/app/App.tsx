import React from 'react';
import { components } from '@application';

const { Provider, Router, StateProvider, MobileRoot } = components;

export default () => (
  <StateProvider>
    <MobileRoot />
    <Provider>
      <Router />
    </Provider>
  </StateProvider>
);
