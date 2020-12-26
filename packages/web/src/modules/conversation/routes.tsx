import React from 'react';
import application, { components } from '@application';
import Conversations from './pages/conversations';

const { AuthorizedRoute, MobileRoute } = components;

application.services.addRoute(() => (
  <AuthorizedRoute exact path="/conversations">
    <MobileRoute exact path="/conversations">
      <Conversations />
    </MobileRoute>
  </AuthorizedRoute>
));
