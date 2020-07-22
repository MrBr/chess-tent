import React from 'react';
import application, { components, pages } from '@application';

const { Route } = components;
const { Home } = pages;

application.services.addRoute(() => (
  <Route exact path="/">
    <Home />
  </Route>
));
