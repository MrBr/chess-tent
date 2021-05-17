import React from 'react';
import { components } from '@application';

const { Router, StateProvider, MobileRoot } = components;

export default () => (
  <>
    <MobileRoot />
    <StateProvider>
      <Router />
    </StateProvider>
  </>
);
