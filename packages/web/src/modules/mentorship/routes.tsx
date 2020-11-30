import React from 'react';
import application, { components } from '@application';
import Coaches from './pages/coaches';
import Students from './pages/students';

const { AuthorizedRoute } = components;

application.services.addRoute(() => (
  <AuthorizedRoute exact path="/me/coaches">
    <Coaches />
  </AuthorizedRoute>
));
application.services.addRoute(() => (
  <AuthorizedRoute exact path="/me/students">
    <Students />
  </AuthorizedRoute>
));
