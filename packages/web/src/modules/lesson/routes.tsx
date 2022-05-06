import React from 'react';
import application, { components } from '@application';
import Lesson from './pages/lesson';
import PreviewLesson from './pages/preview-lesson';
import NewLesson from './pages/new-lesson';
import Activity from './pages/activity';
import Lessons from './pages/browse-lessons';
import Templates from './pages/templates';
import Studies from './pages/studies';

const { Switch, AuthorizedRoute } = components;

application.services.addRoute(() => (
  <Switch>
    <AuthorizedRoute path="/lesson/new" exact>
      <NewLesson />
    </AuthorizedRoute>
    <AuthorizedRoute path="/lesson/:lessonId" exact>
      <Lesson />
    </AuthorizedRoute>
    <AuthorizedRoute path="/lesson/preview/:lessonId" exact>
      <PreviewLesson />
    </AuthorizedRoute>
  </Switch>
));

application.services.addRoute(() => (
  <AuthorizedRoute path="/activity/:activityId">
    <Activity />
  </AuthorizedRoute>
));
application.services.addRoute(() => (
  <AuthorizedRoute path="/lessons">
    <Lessons />
  </AuthorizedRoute>
));
application.services.addRoute(() => (
  <AuthorizedRoute path="/templates">
    <Templates />
  </AuthorizedRoute>
));
application.services.addRoute(() => (
  <AuthorizedRoute path="/studies">
    <Studies />
  </AuthorizedRoute>
));
