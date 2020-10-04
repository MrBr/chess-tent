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
import { createBrowserHistory, History, LocationState } from 'history';

const routes: ComponentType[] = [];
const history = new Proxy(createBrowserHistory(), {
  get(target: History, prop: PropertyKey, receiver: any): any {
    if (prop === 'push') {
      return (path: string, state: LocationState) =>
        Reflect.get(
          target,
          prop,
          receiver,
        )(path, {
          from: target.location.pathname,
          ...state,
        });
    }
    return Reflect.get(target, prop, receiver);
  },
});

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
application.components.Switch = Switch;
application.components.Route = Route;
application.components.Link = Link;
application.components.Redirect = Redirect;
application.services.addRoute = addRoute;
application.services.history = history;
application.hooks.useHistory = useHistory;
application.hooks.useLocation = useLocation;
application.hooks.useParams = useParams;
