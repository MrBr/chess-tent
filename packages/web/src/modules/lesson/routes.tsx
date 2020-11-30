import React from 'react';
import application, { components } from '@application';
import Lesson from './pages/lesson';
import NewLesson from './pages/new-lesson';
import Activity from './pages/activity';

const { Route, Switch } = components;

application.services.addRoute(() => (
  <Switch>
    <Route path="/lesson/new" exact>
      <NewLesson />
    </Route>
    <Route path="/lesson/:lessonId" exact>
      <Lesson />
    </Route>
  </Switch>
));

application.services.addRoute(() => (
  <Route path="/activity/:activityId">
    <Activity />
  </Route>
));
