import React from 'react';
import application, { components } from '@application';
import Register from './pages/register';
import Login from './pages/login';
import Me from './pages/me';

const { Route, Authorized } = components;

application.services.addRoute(() => (
  <Route exact path="/register">
    <Register />
  </Route>
));

application.services.addRoute(() => (
  <Route exact path="/login">
    <Login />
  </Route>
));
application.services.addRoute(() => (
  <Authorized>
    <Route exact path="/me">
      <Me />
    </Route>
  </Authorized>
));
