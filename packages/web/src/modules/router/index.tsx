import React, { ComponentType } from 'react';
import application, { ui } from '@application';
import { Components, RenderPropComponentType, Services, History } from '@types';
import isPropValid from '@emotion/is-prop-valid';
import {
  Switch,
  Route,
  Redirect,
  Link as RLink,
  useHistory,
  useParams,
  useLocation,
  Router as BaseRouter,
} from 'react-router-dom';
import { createBrowserHistory, LocationState } from 'history';
import styled from '@emotion/styled';

const { Icon } = ui;

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

const Router: RenderPropComponentType = ({ children }) => {
  return (
    <BaseRouter history={history}>
      {children(
        <Switch>
          <>
            {routes.map((Page, index) => (
              <Page key={index} />
            ))}
          </>
        </Switch>,
      )}
    </BaseRouter>
  );
};

const Back = () => {
  const history = useHistory();
  return <Icon onClick={() => history.go(1)} type="close" />;
};

const addRoute: Services['addRoute'] = Route => {
  routes.push(Route);
};

const Link = styled<Components['Link']>(RLink, {
  shouldForwardProp: (propName: string) =>
    isPropValid(propName) && propName !== 'ghost',
})(
  ({ ghost }) =>
    ghost && {
      color: 'inherit',
      textDecoration: 'inherit',
      '&:hover, &:focus, &:visited, &:link, &:active': {
        color: 'inherit',
        textDecoration: 'inherit',
      },
    },
);

export function useQuery<T extends Record<string, string | undefined>>(): T {
  const query: Record<string, string> = {};
  const searchParams = new URLSearchParams(useLocation().search);
  searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query as T;
}

application.components.Router = Router;
application.components.Switch = Switch;
application.components.Route = Route;
application.components.Link = Link;
application.components.Back = Back;
application.components.Redirect = Redirect;
application.services.addRoute = addRoute;
application.services.history = history;
application.hooks.useHistory = useHistory;
application.hooks.useLocation = useLocation;
application.hooks.useParams = useParams;
application.hooks.useQuery = useQuery;
