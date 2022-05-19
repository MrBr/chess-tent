import React, { ComponentType } from 'react';
import application, { constants } from '@application';
import { Components, History, RenderPropComponentType, Services } from '@types';
import {
  Switch,
  Route,
  Redirect,
  Link as RLink,
  useHistory,
  useParams,
  useLocation,
  Router as BaseRouter,
  Prompt,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import styled from '@chess-tent/styled-props';

const { APP_URL } = constants;

const routes: ComponentType[] = [];

const history: History = createBrowserHistory();
const basePush = history.push.bind(history);
const baseGoBack = history.goBack.bind(history);
history.push = function <T extends {}>(path: string, state?: T) {
  basePush(path, {
    from: history.location.pathname,
    ...state,
  });
};
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

const addRoute: Services['addRoute'] = Route => {
  routes.push(Route);
};

const Link = styled<Components['Link']>(RLink).ghost.css<{}>`
  ${{ omitProps: ['ghost'] }}
  color: var(--primary-color);

  &:hover, &:focus, &:visited, &:link, &:active {
    color: var(--primary-color);
  }

  &.ghost {
    color: inherit;
    text-decoration: inherit;

    &:hover, &:focus, &:visited, &:link, &:active {
      color: inherit;
      text-decoration: inherit;
    }
  }
`;

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
application.components.RedirectPrompt = Prompt;
application.components.Link = Link;
application.components.Redirect = Redirect;
application.services.addRoute = addRoute;
application.services.history = history;
application.hooks.useHistory = useHistory;
application.hooks.useLocation = useLocation;
application.hooks.useParams = useParams;
application.hooks.useQuery = useQuery;
application.utils.isLocalReferrer = isLocalReferrer;
