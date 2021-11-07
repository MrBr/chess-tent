import React, { ComponentType } from 'react';
import application, { ui, constants } from '@application';
import { Components, History, RenderPropComponentType, Services } from '@types';
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
const { APP_URL } = constants;

const routes: ComponentType[] = [];

const history: History = createBrowserHistory();
const basePush = history.push.bind(history);
const baseGoBack = history.goBack.bind(history);
history.push = function (path: string, state?: LocationState) {
  basePush(path, {
    from: history.location.pathname,
    ...state,
  });
}.bind(history);
history.goBack = function (this: typeof history) {
  // Go back in this case doesn't lead out of the application
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  isLocalReferrer() ? baseGoBack() : this.replace('/');
}.bind(history);

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
  return <Icon onClick={history.goBack} type="close" />;
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

export const isLocalReferrer = () =>
  document.referrer.search(APP_URL) > -1 || !!history.location.state?.from;

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
application.utils.isLocalReferrer = isLocalReferrer;
