import React from 'react';
import application, { components } from '@application';
import Register from './pages/register';
import Login from './pages/login';
import Me from './pages/me';
import User from './pages/user';
import CoachBrowser from './pages/coach-browser';

const { Route, AuthorizedRoute } = components;

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
  <AuthorizedRoute exact path="/me">
    <Me />
  </AuthorizedRoute>
));

application.services.addRoute(() => (
  <AuthorizedRoute exact path="/user/:userId">
    <User />
  </AuthorizedRoute>
));

application.services.addRoute(() => (
  <AuthorizedRoute path="/coaches" exact>
    <CoachBrowser />
  </AuthorizedRoute>
));
