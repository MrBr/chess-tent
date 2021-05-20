import React from 'react';
import { components } from '@application';

const { Provider, Router, StateProvider, MobileRoot } = components;

export default () => (
  <>
    <MobileRoot />
    <StateProvider>
      <Router>
        {(routes: React.ReactNode) => <Provider>{routes}</Provider>}
      </Router>
    </StateProvider>
  </>
);
