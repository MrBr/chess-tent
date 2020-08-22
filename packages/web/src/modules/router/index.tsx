import React, { ComponentType } from 'react';
import application from '@application';
import { Services } from '@types';
import {
  Switch,
  BrowserRouter,
  Route,
  Redirect,
  Link,
  useHistory,
  useParams,
} from 'react-router-dom';

const routes: ComponentType[] = [];

const Router: ComponentType = () => {
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
application.components.Link = Link;
application.components.Redirect = Redirect;
application.services.addRoute = addRoute;
application.hooks.useHistory = useHistory;
application.hooks.useParams = useParams;
