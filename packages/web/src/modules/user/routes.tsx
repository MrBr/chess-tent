import React from 'react';
import application, { components } from '@application';
import Register from './pages/register';

const { Route } = components;

application.services.addRoute(() => (
  <Route exact path="/register">
    <Register />
  </Route>
));
