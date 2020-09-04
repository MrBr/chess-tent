import React, { ComponentType } from 'react';
import application from '@application';
import { Services } from '@types';
import {
  Switch,
  Route,
  Redirect,
  Link,
  useHistory,
  useParams,
  useLocation,
  Router as BaseRouter,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';

const routes: ComponentType[] = [];
const history = createBrowserHistory();

const Router: ComponentType = () => {
  return (
    <BaseRouter history={history}>
      <Switch>
        <>
          {routes.map((Page, index) => (
            <Page key={index} />
          ))}
        </>
      </Switch>
    </BaseRouter>
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
application.services.history = history;
application.hooks.useHistory = useHistory;
application.hooks.useLocation = useLocation;
application.hooks.useParams = useParams;
