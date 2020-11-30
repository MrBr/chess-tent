import React from 'react';
import application, { components } from '@application';
import Lesson from './pages/lesson';
import NewLesson from './pages/new-lesson';
import Playground from './pages/playground';

const { Switch, AuthorizedRoute } = components;

application.services.addRoute(() => (
  <Switch>
    <AuthorizedRoute path="/lesson/new" exact>
      <NewLesson />
    </AuthorizedRoute>
    <AuthorizedRoute path="/lesson/:lessonId" exact>
      <Lesson />
    </AuthorizedRoute>
  </Switch>
));

application.services.addRoute(() => (
  <AuthorizedRoute path="/activity/:activityId">
    <Playground />
  </AuthorizedRoute>
));
