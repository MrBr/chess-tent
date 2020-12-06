import React from 'react';
import { Components } from '@types';
import { hooks, components } from '@application';

const { Redirect, Route } = components;

export const Authorized: Components['Authorized'] = ({ children }) => {
  const authorized = !!hooks.useActiveUserRecord()[0];

  if (typeof children === 'function') {
    return children(authorized);
  }

  return <>{authorized ? children : null}</>;
};

export const AuthorizedRoute: Components['AuthorizedRoute'] = ({
  children,
  redirectRoute = '/',
  ...props
}) => {
  return (
    <Route {...props}>
      <Authorized>
        {authorize =>
          !!authorize ? children : <Redirect to={redirectRoute} />
        }
      </Authorized>
    </Route>
  );
};
