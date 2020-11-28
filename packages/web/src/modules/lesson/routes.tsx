import React from 'react';
import application, { components } from '@application';
import Lesson from './pages/lesson';
import NewLesson from './pages/new-lesson';
import Playground from './pages/playground';

const { Route, Switch, Authorized } = components;

application.services.addRoute(() => (
  <Authorized>
    <Switch>
      <Route path="/lesson/new" exact>
        <NewLesson />
      </Route>
      <Route path="/lesson/:lessonId" exact>
        <Lesson />
      </Route>
    </Switch>
  </Authorized>
));

application.services.addRoute(() => (
  <Authorized>
    <Route path="/activity/:activityId">
      <Playground />
    </Route>
  </Authorized>
));
