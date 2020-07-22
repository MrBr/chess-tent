import React, { ComponentType } from 'react';
import application from '@application';
import { Components, Services } from '@types';
import { Switch, BrowserRouter, Route } from 'react-router-dom';

const routes: ComponentType[] = [];

const Router: Components['Router'] = () => {
  console.log(routes);
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
application.services.addRoute = addRoute;
