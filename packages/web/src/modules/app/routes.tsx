import React from 'react';
import application, { components, pages } from '@application';

const { Route } = components;
const { Home, About } = pages;

application.services.addRoute(() => (
  <Route exact path="/">
    <Home />
  </Route>
));
application.services.addRoute(() => (
  <Route exact path="/about">
    <About />
  </Route>
));
