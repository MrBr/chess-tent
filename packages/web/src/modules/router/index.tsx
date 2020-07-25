import React, { ComponentType } from 'react';
import application from '@application';
import { Components, Services } from '@types';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';

const routes: ComponentType[] = [];

const Router: Components['Router'] = () => {
  return (
    <BrowserRouter>
      <Switch>
        <>
          {routes.map((Page, index) => (
            <Page key={index} />
          ))}
        </>
      </Switch>
    </BrowserRouter>
  );
};

const addRoute: Services['addRoute'] = Route => {
  routes.push(Route);
};

application.components.Router = Router;
application.components.Route = Route;
application.components.Redirect = Redirect;
application.services.addRoute = addRoute;
