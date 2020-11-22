import React from 'react';
import application, { components } from '@application';
import Coaches from './pages/coaches';
import Students from './pages/students';

const { Route, Authorized } = components;

application.services.addRoute(() => (
  <Authorized>
    <Route exact path="/me/coaches">
      <Coaches />
    </Route>
  </Authorized>
));
application.services.addRoute(() => (
  <Authorized>
    <Route exact path="/me/students">
      <Students />
    </Route>
  </Authorized>
));
