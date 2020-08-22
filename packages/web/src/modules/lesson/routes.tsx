import React from 'react';
import application, { components } from '@application';
import Lesson from './pages/lesson';

const { Route } = components;

application.services.addRoute(() => (
  <Route path="/lesson/:lessonId?">
    <Lesson />
  </Route>
));
