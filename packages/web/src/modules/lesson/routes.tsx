import React from 'react';
import application, { components } from '@application';
import Lesson from './pages/lesson';
import Playground from './pages/playground';

const { Route } = components;

application.services.addRoute(() => (
  <Route path="/lesson/:lessonId?">
    <Lesson />
  </Route>
));

application.services.addRoute(() => (
  <Route path="/activity/:activityId">
    <Playground />
  </Route>
));
