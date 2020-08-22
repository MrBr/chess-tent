import React from 'react';
import { components } from '@application';

const { Provider, Router, StateProvider } = components;

export default () => (
  <StateProvider>
    <Provider>
      <Router />
    </Provider>
  </StateProvider>
);
