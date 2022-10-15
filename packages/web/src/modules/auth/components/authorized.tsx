import React from 'react';
import { Components } from '@types';
import { hooks, components } from '@application';

const { Redirect, Route } = components;
const { useLocation } = hooks;

export const Authorized: Components['Authorized'] = ({ children }) => {
  const authorized = !!hooks.useActiveUserRecord(null).value;

  if (typeof children === 'function') {
    return children(authorized);
  }

  return <>{authorized ? children : null}</>;
};

export const AuthorizedRoute: Components['AuthorizedRoute'] = ({
  children,
  redirectRoute,
  ...props
}) => {
  const location = useLocation();
  const redirect =
    redirectRoute || `/login?redirect=${encodeURI(location.pathname)}`;

  return (
    <Route {...props}>
      <Authorized>
        {authorize => (!!authorize ? children : <Redirect to={redirect} />)}
      </Authorized>
    </Route>
  );
};
